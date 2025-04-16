
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, UserPlus, UserCog, MessageSquare, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserRoleDialog from "./UserRoleDialog";
import { UserRole } from "@/services/types/rbac";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);
  
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
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user role assignment
  const handleOpenRoleDialog = (user: any) => {
    setSelectedUser(user);
    // Ensure the selected role is a valid UserRole type
    setSelectedRole((user.roles?.length > 0 ? user.roles[0] : "user") as UserRole);
    setShowRoleDialog(true);
  };
  
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      // First delete existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUser.id);
      
      // Then add the new role, ensuring it's a valid UserRole
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role: selectedRole as UserRole
        });
      
      if (error) throw error;
      
      toast({
        title: "Role assigned",
        description: `${selectedUser.full_name || 'User'} has been assigned the ${selectedRole} role.`
      });
      
      // Refresh user data
      fetchUsers();
      setShowRoleDialog(false);
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive"
      });
    }
  };

  // Handle add new user
  const handleAddUser = () => {
    // Save redirect URL to return after auth
    localStorage.setItem("authRedirectUrl", "/admin");
    // Redirect to auth page
    navigate('/auth');
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
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search users..."
              className="max-w-xs"
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button 
              className="bg-black hover:bg-gray-800"
              onClick={handleAddUser}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        {userSearchTerm ? "No users matching your search" : "No users found"}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                              {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : "??"}
                            </div>
                            <div>
                              <div className="font-medium">
                                {user.full_name || 'Unnamed User'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.username || 'No username'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={
                            user.roles?.includes('admin') ? "bg-red-100 text-red-800" : 
                            user.roles?.includes('moderator') ? "bg-blue-100 text-blue-800" : 
                            user.roles?.includes('creator') ? "bg-green-100 text-green-800" :
                            user.roles?.includes('employee') ? "bg-purple-100 text-purple-800" :
                            "bg-gray-100 text-gray-800"
                          }>
                            {user.roles?.length > 0 ? user.roles[0] : "User"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {isAdmin && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleOpenRoleDialog(user)}
                              >
                                <UserCog className="h-4 w-4" />
                              </Button>
                            )}
                            {isAdmin && (
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            )}
                            {isAdmin && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <UserRoleDialog 
        showDialog={showRoleDialog}
        setShowDialog={setShowRoleDialog}
        selectedUser={selectedUser}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onAssignRole={handleAssignRole}
      />
    </>
  );
};

export default UserManagement;
