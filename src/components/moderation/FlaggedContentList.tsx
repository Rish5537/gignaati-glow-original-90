
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FlaggedContentFilters } from './FlaggedContentFilters';
import { FlaggedContentHeader } from './FlaggedContentHeader';
import { FlaggedContentItem } from './FlaggedContentItem';
import { EnhancedFlaggedContent } from './types';
import { fetchFlaggedContent, updateFlaggedContentStatus } from './FlaggedContentService';

const FlaggedContentList = () => {
  const [flaggedItems, setFlaggedItems] = useState<EnhancedFlaggedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    loadFlaggedContent();
  }, [typeFilter, statusFilter, sortField, sortDirection]);

  const loadFlaggedContent = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFlaggedContent(typeFilter, statusFilter, sortField, sortDirection);
      setFlaggedItems(data);
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

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateFlaggedContentStatus(id, 'approved');
      
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
      await updateFlaggedContentStatus(id, 'rejected');
      
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

  if (isLoading) {
    return <div>Loading flagged content...</div>;
  }

  return (
    <div className="space-y-4">
      <FlaggedContentFilters 
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        toggleSort={toggleSort}
      />

      <div className="rounded-md border">
        <FlaggedContentHeader toggleSort={toggleSort} />

        {flaggedItems.length > 0 ? (
          flaggedItems.map((item) => (
            <FlaggedContentItem
              key={item.id}
              item={item}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
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
