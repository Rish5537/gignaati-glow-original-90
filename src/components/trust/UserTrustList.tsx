
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle2, 
  XCircle,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Define interfaces for user trust data
interface UserProfile {
  full_name?: string | null;
  avatar_url?: string | null;
  username?: string | null;
}

interface SafeUserTrust {
  id: string;
  user_id: string;
  trust_score: number;
  warning_count: number;
  suspension_count: number;
  is_suspended: boolean;
  suspension_reason: string | null;
  suspension_until: string | null;
  last_warning_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: UserProfile | null;
}

const UserTrustList = () => {
  const [users, setUsers] = useState<SafeUserTrust[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SafeUserTrust | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [suspensionDays, setSuspensionDays] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('trust_score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, sortField, sortDirection]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('user_trust_records')
        .select(`
          *,
          profile:profiles(*)
        `);
      
      if (statusFilter === 'suspended') {
        query = query.eq('status', 'suspended');
      } else if (statusFilter === 'active') {
        query = query.eq('status', 'active');
      } else if (statusFilter === 'warned') {
        query = query.gt('warning_count', 0).eq('status', 'active');
      }
      
      query = query.order(sortField, { ascending: sortDirection === 'asc' });
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      const transformedData = data?.map(record => {
        // Safely handle the suspension_history field
        const suspensionHistory = record.suspension_history as any[] || [];
        
        return {
          id: record.id,
          user_id: record.user_id,
          trust_score: record.trust_score || 100,
          warning_count: record.warning_count || 0,
          suspension_count: suspensionHistory.length || 0,
          is_suspended: record.status === 'suspended',
          suspension_reason: record.status === 'suspended' && suspensionHistory.length > 0 ? 
            suspensionHistory[0]?.reason || null : null,
          suspension_until: record.status === 'suspended' && suspensionHistory.length > 0 ? 
            suspensionHistory[0]?.until || null : null,
          last_warning_at: record.last_warning_date,
          created_at: record.created_at,
          updated_at: record.updated_at,
          profile: record.profile as UserProfile | null
        };
      });
      
      setUsers(transformedData as SafeUserTrust[]);
    } catch (error) {
      console.error('Error fetching user trust data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user trust data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendUser = async () => {
    if (!selectedUser || !actionReason) return;
    
    try {
      const suspensionUntil = new Date();
      suspensionUntil.setDate(suspensionUntil.getDate() + suspensionDays);
      
      const { data: userData, error: fetchError } = await supabase
        .from('user_trust_records')
        .select('suspension_history')
        .eq('id', selectedUser.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const suspensionHistory = [
        ...(userData?.suspension_history as any[] || []),
        {
          reason: actionReason,
          until: suspensionUntil.toISOString(),
          created_at: new Date().toISOString()
        }
      ];
      
      const { error } = await supabase
        .from('user_trust_records')
        .update({
          status: 'suspended',
          suspension_history: suspensionHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...user, 
                is_suspended: true,
                suspension_reason: actionReason,
                suspension_until: suspensionUntil.toISOString(),
                suspension_count: user.suspension_count + 1,
                updated_at: new Date().toISOString()
              } 
            : user
        )
      );
      
      toast({
        title: 'User suspended',
        description: `User has been suspended for ${suspensionDays} day${suspensionDays > 1 ? 's' : ''}`
      });
      
      setActionReason('');
      setSuspendDialogOpen(false);
    } catch (error) {
      console.error('Error suspending user:', error);
      toast({
        title: 'Error',
        description: 'Failed to suspend user',
        variant: 'destructive',
      });
    }
  };

  const handleWarnUser = async () => {
    if (!selectedUser || !actionReason) return;
    
    try {
      const { error } = await supabase
        .from('user_trust_records')
        .update({
          warning_count: selectedUser.warning_count + 1,
          last_warning_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...user, 
                warning_count: user.warning_count + 1,
                last_warning_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            : user
        )
      );
      
      toast({
        title: 'Warning issued',
        description: 'A warning has been issued to the user'
      });
      
      setActionReason('');
      setWarnDialogOpen(false);
    } catch (error) {
      console.error('Error warning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to issue warning',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveSuspension = async (user: SafeUserTrust) => {
    try {
      const { error } = await supabase
        .from('user_trust_records')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { 
                ...u, 
                is_suspended: false,
                suspension_reason: null,
                suspension_until: null,
                updated_at: new Date().toISOString()
              } 
            : u
        )
      );
      
      toast({
        title: 'Suspension removed',
        description: 'User suspension has been removed'
      });
    } catch (error) {
      console.error('Error removing suspension:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove suspension',
        variant: 'destructive',
      });
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Trust {score}%</Badge>;
    } else if (score >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Trust {score}%</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Low Trust {score}%</Badge>;
    }
  };

  const getStatusBadge = (user: SafeUserTrust) => {
    if (user.is_suspended) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" /> Suspended
      </Badge>;
    } else if (user.warning_count > 0) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" /> Warned ({user.warning_count})
      </Badge>;
    } else {
      return <Badge variant="outline" className="flex items-center gap-1 bg-green-100 border-green-300 text-green-800">
        <CheckCircle2 className="h-3 w-3" /> Good Standing
      </Badge>;
    }
  };

  if (isLoading) {
    return <div>Loading user trust data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">User Trust & Safety Controls</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="warned">Warned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted/50">
          <div className="col-span-4 flex items-center gap-1">
            User
          </div>
          <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('trust_score')}>
            Trust Score
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 hidden md:flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('warning_count')}>
            Warnings
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 hidden lg:flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('status')}>
            Status
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-4 md:col-span-2 flex justify-end">
            Actions
          </div>
        </div>

        {users.length > 0 ? (
          users.map((user) => (
            <div 
              key={user.id} 
              className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-muted/30"
            >
              <div className="col-span-4 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profile?.avatar_url || ''} />
                  <AvatarFallback>
                    {(user.profile?.full_name || 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.profile?.full_name || user.profile?.username || 'Unknown User'}</div>
                  <div className="text-xs text-muted-foreground">ID: {user.user_id.substring(0, 8)}</div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                {getTrustScoreBadge(user.trust_score)}
              </div>
              <div className="col-span-2 hidden md:flex items-center">
                <Badge variant="outline">
                  {user.warning_count} warning{user.warning_count !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="col-span-2 hidden lg:flex items-center">
                {getStatusBadge(user)}
              </div>
              <div className="col-span-4 md:col-span-2 flex justify-end gap-2">
                {user.is_suspended ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveSuspension(user)}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" /> 
                    Remove Suspension
                  </Button>
                ) : (
                  <>
                    <Dialog open={warnDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                      setWarnDialogOpen(open);
                      if (!open) setActionReason('');
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="flex items-center gap-1"
                        >
                          <AlertTriangle className="h-3 w-3" /> 
                          Warn
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Issue Warning</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.profile?.avatar_url || ''} />
                              <AvatarFallback>
                                {(user.profile?.full_name || 'U').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.profile?.full_name || user.profile?.username || 'Unknown User'}</div>
                              <div className="text-sm text-muted-foreground">Current Warnings: {user.warning_count}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="warnReason">Warning Reason (Required)</Label>
                            <Textarea
                              id="warnReason"
                              placeholder="Enter the reason for this warning..."
                              value={actionReason}
                              onChange={(e) => setActionReason(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setWarnDialogOpen(false);
                            setActionReason('');
                          }}>Cancel</Button>
                          <Button 
                            onClick={handleWarnUser}
                            disabled={!actionReason.trim()}
                            className="flex items-center gap-1"
                          >
                            <AlertTriangle className="h-4 w-4" /> Issue Warning
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={suspendDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                      setSuspendDialogOpen(open);
                      if (!open) {
                        setActionReason('');
                        setSuspensionDays(1);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="flex items-center gap-1"
                        >
                          <Shield className="h-3 w-3" /> 
                          Suspend
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Suspend User</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.profile?.avatar_url || ''} />
                              <AvatarFallback>
                                {(user.profile?.full_name || 'U').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.profile?.full_name || user.profile?.username || 'Unknown User'}</div>
                              <div className="text-sm text-muted-foreground">Previous Suspensions: {user.suspension_count}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="suspensionDays">Suspension Duration (Days)</Label>
                            <Select
                              value={suspensionDays.toString()}
                              onValueChange={(value) => setSuspensionDays(parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 day</SelectItem>
                                <SelectItem value="3">3 days</SelectItem>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="14">14 days</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="suspensionReason">Suspension Reason (Required)</Label>
                            <Textarea
                              id="suspensionReason"
                              placeholder="Enter the reason for this suspension..."
                              value={actionReason}
                              onChange={(e) => setActionReason(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setSuspendDialogOpen(false);
                            setActionReason('');
                          }}>Cancel</Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleSuspendUser}
                            disabled={!actionReason.trim()}
                            className="flex items-center gap-1"
                          >
                            <Shield className="h-4 w-4" /> Suspend User
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No user trust data found matching the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTrustList;
