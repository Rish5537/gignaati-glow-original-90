
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
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
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
      // First get users from auth.users table
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }

      // Then get profiles with roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, created_at, role');
      
      if (profilesError) {
        console.warn("Error fetching profiles:", profilesError);
      }
      
      // Map profiles to users
      const profilesMap = new Map();
      if (profiles) {
        profiles.forEach((profile: any) => {
          profilesMap.set(profile.id, profile);
        });
      }
      
      // Combine all user data
      const usersWithDetails = authUsers.users.map((user: any) => {
        const profile = profilesMap.get(user.id) || {};
        const role = profile.role || 'buyer';
        
        return {
          id: user.id,
          email: user.email,
          full_name: profile.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unnamed User',
          username: profile.username,
          avatar_url: profile.avatar_url,
          created_at: user.created_at,
          role: role
        };
      });
      
      setUsers(usersWithDetails);
      setFilteredUsers(usersWithDetails);
      return usersWithDetails;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users data. Please refresh and try again.",
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
    // Use the role from the user object
    setSelectedRole((user.role || "buyer") as UserRole);
    setShowRoleDialog(true);
  };
  
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      // Update the profile's role
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Role assigned",
        description: `${selectedUser.full_name || selectedUser.email || 'User'} has been assigned the ${selectedRole} role.`
      });
      
      // Refresh user data
      fetchUsers();
      setShowRoleDialog(false);
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive"
      });
    }
  };

  // New function for quick role change
  const handleQuickRoleChange = async (userId: string, role: UserRole) => {
    try {
      // Update the profile's role
      const { error } = await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', userId);
      
      if (error) throw error;
      
      const user = users.find(user => user.id === userId);
      toast({
        title: "Role updated",
        description: `${user?.full_name || user?.email || 'User'} has been assigned the ${role} role.`
      });
      
      // Refresh user data
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
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
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
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
    handleDeleteUser,
    handleQuickRoleChange
  };
};
