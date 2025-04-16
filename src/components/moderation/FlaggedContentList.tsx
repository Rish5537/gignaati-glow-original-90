import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Flag, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  MoreHorizontal,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlaggedContent } from '@/types/supabase';

const FlaggedContentList = () => {
  const [flaggedItems, setFlaggedItems] = useState<FlaggedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchFlaggedContent();
  }, [typeFilter, statusFilter, sortField, sortDirection]);

  const fetchFlaggedContent = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('flagged_content')
        .select('*, profiles!reporter_id(full_name)');
      
      // Apply filters
      if (typeFilter !== 'all') {
        query = query.eq('content_type', typeFilter);
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      // Transform data to include reporter name from profiles relation
      const transformedData = data?.map(item => ({
        ...item,
        reporter_name: item.profiles?.full_name || 'Unknown user'
      }));
      
      setFlaggedItems(transformedData || []);
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flagged content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flagged_content')
        .update({ status: 'approved' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setFlaggedItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, status: 'approved' } : item
        )
      );
      
      toast({
        title: 'Flag approved',
        description: 'Content has been flagged as inappropriate'
      });
    } catch (error) {
      console.error('Error approving flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve flag',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flagged_content')
        .update({ status: 'rejected' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setFlaggedItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, status: 'rejected' } : item
        )
      );
      
      toast({
        title: 'Flag rejected',
        description: 'The content has been deemed appropriate'
      });
    } catch (error) {
      console.error('Error rejecting flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject flag',
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

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'gig':
        return <Badge variant="outline" className="bg-blue-50">Gig</Badge>;
      case 'message':
        return <Badge variant="outline" className="bg-green-50">Message</Badge>;
      case 'profile':
        return <Badge variant="outline" className="bg-purple-50">Profile</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-orange-50">Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="destructive">Flag Approved</Badge>;
      case 'rejected':
        return <Badge variant="default">Flag Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <div>Loading flagged content...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Flagged Content</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="gig">Gigs</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="profile">Profiles</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted/50">
          <div className="col-span-4 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('content_type')}>
            Content
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-3 hidden md:flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('reason')}>
            Reason
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 hidden lg:flex items-center gap-1" onClick={() => toggleSort('reporter_id')}>
            Reporter
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-3 md:col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('status')}>
            Status
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 md:col-span-1 flex justify-end">
            Actions
          </div>
        </div>

        {flaggedItems.length > 0 ? (
          flaggedItems.map((item) => (
            <div 
              key={item.id} 
              className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-muted/30"
            >
              <div className="col-span-4 space-y-1">
                <div className="flex items-center gap-2">
                  {getContentTypeIcon(item.content_type)}
                  <span className="text-sm font-medium truncate">ID: {item.content_id.substring(0, 8)}</span>
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {item.content_preview || 'No preview available'}
                </div>
              </div>
              <div className="col-span-3 hidden md:block">
                <span className="text-sm truncate line-clamp-2">{item.reason}</span>
              </div>
              <div className="col-span-2 hidden lg:block">
                <span className="text-sm">{item.reporter_name}</span>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(item.created_at), 'MMM dd, yyyy')}
                </div>
              </div>
              <div className="col-span-3 md:col-span-2">
                {getStatusBadge(item.status)}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                {item.status === 'pending' ? (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleApprove(item.id)} title="Approve Flag">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleReject(item.id)} title="Reject Flag">
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleApprove(item.id)}>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Approve Flag
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReject(item.id)}>
                        <X className="h-4 w-4 mr-2 text-red-600" />
                        Reject Flag
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No flagged content found matching the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default FlaggedContentList;
