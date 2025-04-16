
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/services/types/rbac";

export const useUserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer");
  const { toast } = useToast();

  // Search and filter functions
  useEffect(() => {
    if (userSearchTerm) {
      const filtered = users.filter(user => 
        user.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
        user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [userSearchTerm, users]);

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, created_at');
      
      if (profilesError) throw profilesError;
      
      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Combine data
      const usersWithRoles = profiles.map((profile: any) => {
        const roles = userRoles
          .filter((role: any) => role.user_id === profile.id)
          .map((role: any) => role.role);
        
        return {
          ...profile,
          roles
        };
      });
      
      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
      return usersWithRoles;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user role assignment
  const handleOpenRoleDialog = (user: any) => {
    setSelectedUser(user);
    // Ensure the selected role is a valid UserRole type
    setSelectedRole((user.roles?.length > 0 ? user.roles[0] : "buyer") as UserRole);
    setShowRoleDialog(true);
  };
  
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      // First delete existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUser.id);
      
      if (deleteError) throw deleteError;
      
      // Then add the new role, ensuring it's a valid UserRole
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role: selectedRole as UserRole
        });
      
      if (insertError) throw insertError;
      
      toast({
        title: "Role assigned",
        description: `${selectedUser.full_name || 'User'} has been assigned the ${selectedRole} role.`
      });
      
      // Refresh user data
      fetchUsers();
      setShowRoleDialog(false);
    } catch (error: any) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive"
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: userId }
      });
      
      if (error) throw error;
      
      toast({
        title: "User deleted",
        description: "User has been successfully deleted"
      });
      
      // Refresh users
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  return {
    users,
    filteredUsers,
    userSearchTerm,
    setUserSearchTerm,
    isLoading,
    showRoleDialog,
    setShowRoleDialog,
    selectedUser,
    selectedRole,
    setSelectedRole,
    fetchUsers,
    handleOpenRoleDialog,
    handleAssignRole,
    handleDeleteUser
  };
};
