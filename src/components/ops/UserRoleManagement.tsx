
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserRoleAssignment } from "@/services/types/rbac";
import { getAllUserRoles, assignRole, removeRole } from "@/services/RBACService";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  ops_team: "bg-blue-100 text-blue-800",
  creator: "bg-green-100 text-green-800",
  buyer: "bg-purple-100 text-purple-800",
  moderator: "bg-amber-100 text-amber-800",
};

const UserRoleManagement = () => {
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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Role Management</CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign Role
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : Object.keys(groupedRoles).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedRoles).map(([userId, roles]) => {
                // Find user info
                const userInfo = users.find(u => u.id === userId);
                
                // Filter based on search if needed
                if (searchQuery && !(
                  userInfo?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (userInfo?.full_name && userInfo.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
                )) {
                  return null;
                }
                
                return (
                  <div key={userId} className="border rounded-md p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                        {userInfo?.full_name?.charAt(0) || userInfo?.email.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-medium">
                          {userInfo?.full_name || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {userInfo?.email || userId}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Assigned Roles:</div>
                      <div className="flex flex-wrap gap-2">
                        {roles.map(role => (
                          <div key={role.id} className="flex items-center">
                            <Badge className={roleColors[role.role] || "bg-gray-100"}>
                              {role.role}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveRole(role.id)}
                              className="h-6 w-6 p-1 ml-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No user roles found</h3>
              <p className="text-gray-500 mt-2">
                Click "Assign Role" to add roles to users.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign User Role</DialogTitle>
            <DialogDescription>
              Assign a role to a user to determine their permissions in the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                          selectedUser === user.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => setSelectedUser(user.id)}
                      >
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                          {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.full_name || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="ops_team">Operations Team</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRoleManagement;
