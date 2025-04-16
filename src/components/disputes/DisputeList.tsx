
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  User, 
  ArrowUpDown 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DisputeDetail from './DisputeDetail';
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

export interface Dispute {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  reporter_id: string;
  assignee_id: string | null;
  resolution: string | null;
  related_entity_type: 'gig' | 'order' | 'user' | 'payment';
  related_entity_id: string;
  reporter_profile?: {
    full_name: string;
    avatar_url: string | null;
    username: string | null;
  };
  assignee_profile?: {
    full_name: string;
    avatar_url: string | null;
    username: string | null;
  };
}

const DisputeList = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter, priorityFilter, sortField, sortDirection]);

  const fetchDisputes = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('disputes')
        .select(`
          *,
          reporter_profile:profiles!reporter_id(*),
          assignee_profile:profiles!assignee_id(*)
        `);
      
      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }
      
      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      setDisputes(data || []);
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load disputes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
  };

  const handleCloseDetail = () => {
    setSelectedDispute(null);
    fetchDisputes(); // Refresh the list to get updated data
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (status) {
      case 'pending':
        return "destructive";
      case 'in_progress':
        return "secondary";
      case 'resolved':
        return "default";
      case 'closed':
      default:
        return "outline";
    }
  };

  const getPriorityVariant = (priority: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (priority) {
      case 'high':
        return "destructive";
      case 'medium':
        return "secondary";
      case 'low':
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return <div>Loading disputes...</div>;
  }

  if (selectedDispute) {
    return <DisputeDetail dispute={selectedDispute} onClose={handleCloseDetail} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Disputes Management</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted/50">
          <div className="col-span-4 md:col-span-3 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('title')}>
            Title
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 hidden md:flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('reporter_id')}>
            Reporter
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 hidden lg:flex items-center gap-1">
            Assignee
          </div>
          <div className="col-span-3 md:col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('status')}>
            Status
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-3 md:col-span-1 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('priority')}>
            Priority
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 hidden md:flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('created_at')}>
            Created
            <ArrowUpDown className="h-3 w-3" />
          </div>
        </div>

        {disputes.length > 0 ? (
          disputes.map((dispute) => (
            <div 
              key={dispute.id} 
              className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-muted/30 cursor-pointer"
              onClick={() => handleSelectDispute(dispute)}
            >
              <div className="col-span-4 md:col-span-3 truncate">
                {dispute.title}
              </div>
              <div className="col-span-2 hidden md:flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={dispute.reporter_profile?.avatar_url || ''} />
                  <AvatarFallback>
                    {(dispute.reporter_profile?.full_name || 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">
                  {dispute.reporter_profile?.full_name || dispute.reporter_profile?.username || 'Unknown'}
                </span>
              </div>
              <div className="col-span-2 hidden lg:flex items-center gap-2">
                {dispute.assignee_id ? (
                  <>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={dispute.assignee_profile?.avatar_url || ''} />
                      <AvatarFallback>
                        {(dispute.assignee_profile?.full_name || 'A').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">
                      {dispute.assignee_profile?.full_name || dispute.assignee_profile?.username || 'Unknown'}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </div>
              <div className="col-span-3 md:col-span-2 flex items-center">
                <Badge variant={getStatusVariant(dispute.status)} className="flex items-center gap-1">
                  {getStatusIcon(dispute.status)}
                  <span className="capitalize">{dispute.status.replace('_', ' ')}</span>
                </Badge>
              </div>
              <div className="col-span-3 md:col-span-1">
                <Badge variant={getPriorityVariant(dispute.priority)} className="capitalize">
                  {dispute.priority}
                </Badge>
              </div>
              <div className="col-span-2 hidden md:block text-sm text-muted-foreground">
                {format(new Date(dispute.created_at), 'MMM dd, yyyy')}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No disputes found matching the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeList;
