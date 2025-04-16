
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole, UserRoleAssignment } from '@/services/types/rbac';

export const useUserRoleManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRoleAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          created_at,
          profiles:user_id (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Add a dummy updated_at field to satisfy the type
      const rolesWithUpdatedAt = data.map((role: any) => ({
        ...role,
        updated_at: role.created_at // Using created_at as a fallback
      }));

      setUserRoles(rolesWithUpdatedAt as UserRoleAssignment[]);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user roles',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addUserRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase.from('user_roles').insert({
        user_id: userId,
        role,
      });

      if (error) {
        // Check for duplicate role error
        if (error.code === '23505') {
          toast({
            title: 'Role already assigned',
            description: 'This user already has this role assigned.',
            variant: 'destructive',
          });
          return false;
        }
        throw error;
      }

      toast({
        title: 'Role added',
        description: `The ${role} role has been assigned successfully.`,
      });

      fetchUserRoles(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: 'Error',
        description: 'Failed to add role',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeUserRole = async (roleId: string) => {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('id', roleId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Role removed',
        description: 'The role has been removed successfully.',
      });

      setUserRoles((prev) => prev.filter((role) => role.id !== roleId));
      return true;
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove role',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    userRoles,
    isLoading,
    addUserRole,
    removeUserRole,
    refreshUserRoles: fetchUserRoles,
  };
};
