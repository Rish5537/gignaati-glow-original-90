
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole, UserRoleAssignment } from "@/services/types/rbac";
import { getAllUserRoles, assignRole, removeRole } from "@/services/RBACService";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export const useUserRoleManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRoleAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      fetchUsers();
    }
  }, [dialogOpen]);

  useEffect(() => {
    filterUsers();
  }, [users, userSearchQuery]);

  const fetchUserRoles = async () => {
    setIsLoading(true);
    try {
      const roles = await getAllUserRoles();
      setUserRoles(roles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      toast({
        title: "Error",
        description: "Failed to load user roles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url');
      
      if (profilesError) throw profilesError;
      
      // Get user emails from auth.users through Supabase Edge Function or admin API in a real app
      // For now, we'll just use placeholder emails based on user IDs
      
      const usersWithEmails = profiles.map(profile => ({
        id: profile.id,
        email: `user-${profile.id.substring(0, 6)}@example.com`,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      }));
      
      setUsers(usersWithEmails);
      setFilteredUsers(usersWithEmails);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filterUsers = () => {
    if (!userSearchQuery) {
      setFilteredUsers([...users]);
      return;
    }
    
    const query = userSearchQuery.toLowerCase();
    const filtered = users.filter(
      user => 
        user.email.toLowerCase().includes(query) ||
        (user.full_name && user.full_name.toLowerCase().includes(query))
    );
    
    setFilteredUsers(filtered);
  };

  const handleAddRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select both a user and a role.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await assignRole(selectedUser, selectedRole as UserRole);
      
      if (success) {
        toast({
          title: "Success",
          description: `Role "${selectedRole}" assigned successfully.`,
        });
        
        setDialogOpen(false);
        fetchUserRoles();
      } else {
        throw new Error("Failed to assign role");
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role. The user may already have this role.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to remove this role?")) {
      return;
    }
    
    try {
      const success = await removeRole(roleId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Role removed successfully.",
        });
        
        setUserRoles(userRoles.filter(role => role.id !== roleId));
      } else {
        throw new Error("Failed to remove role");
      }
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role.",
        variant: "destructive",
      });
    }
  };

  // Group roles by user_id for display
  const groupedRoles: Record<string, UserRoleAssignment[]> = {};
  userRoles.forEach(role => {
    if (!groupedRoles[role.user_id]) {
      groupedRoles[role.user_id] = [];
    }
    groupedRoles[role.user_id].push(role);
  });

  return {
    userRoles,
    isLoading,
    searchQuery,
    setSearchQuery,
    dialogOpen,
    setDialogOpen,
    users,
    selectedUser,
    setSelectedUser,
    selectedRole,
    setSelectedRole,
    filteredUsers,
    userSearchQuery,
    setUserSearchQuery,
    groupedRoles,
    handleAddRole,
    handleRemoveRole,
  };
};

export type { User };
