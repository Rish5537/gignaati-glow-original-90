
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserListHeader } from './UserListHeader';
import { UserList } from './UserList';
import { SafeUserTrust } from './types';
import { 
  fetchUserTrustData, 
  suspendUser, 
  warnUser, 
  removeSuspension 
} from './UserTrustService';

const UserTrustList = () => {
  const [users, setUsers] = useState<SafeUserTrust[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('trust_score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [statusFilter, sortField, sortDirection]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const userData = await fetchUserTrustData(statusFilter, sortField, sortDirection);
      setUsers(userData);
    } catch (error) {
      console.error('Error loading user trust data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user trust data',
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

  const handleWarnUser = async (userId: string, reason: string) => {
    try {
      const result = await warnUser(userId, reason);
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                warning_count: result.warning_count,
                last_warning_at: result.last_warning_at,
                updated_at: new Date().toISOString()
              } 
            : user
        )
      );
      
      toast({
        title: 'Warning issued',
        description: 'A warning has been issued to the user'
      });
    } catch (error) {
      console.error('Error warning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to issue warning',
        variant: 'destructive',
      });
    }
  };

  const handleSuspendUser = async (userId: string, reason: string, suspensionDays: number) => {
    try {
      const result = await suspendUser(userId, reason, suspensionDays);
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                is_suspended: result.is_suspended,
                suspension_reason: result.suspension_reason,
                suspension_until: result.suspension_until,
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
    } catch (error) {
      console.error('Error suspending user:', error);
      toast({
        title: 'Error',
        description: 'Failed to suspend user',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveSuspension = async (user: SafeUserTrust) => {
    try {
      const result = await removeSuspension(user.id);
      
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { 
                ...u, 
                is_suspended: result.is_suspended,
                suspension_reason: result.suspension_reason,
                suspension_until: result.suspension_until,
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

  if (isLoading) {
    return <div>Loading user trust data...</div>;
  }

  return (
    <div className="space-y-4">
      <UserListHeader 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter}
        toggleSort={toggleSort}
      />

      <div className="rounded-md border">
        <UserList 
          users={users}
          handleWarnUser={handleWarnUser}
          handleSuspendUser={handleSuspendUser}
          handleRemoveSuspension={handleRemoveSuspension}
        />
      </div>
    </div>
  );
};

export default UserTrustList;
