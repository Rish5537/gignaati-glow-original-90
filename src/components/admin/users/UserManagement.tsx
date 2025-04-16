
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserRoleDialog from "./UserRoleDialog";
import UserTable from "./UserTable";
import UserSearchBar from "./UserSearchBar";
import UserTablePagination from "./UserTablePagination";
import CreateUserDialog from "./CreateUserDialog";
import { useUserManagement } from "./useUserManagement";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@/services/types/rbac";

const UserManagement: React.FC = () => {
  const {
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
  } = useUserManagement();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAdmin, createUser } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);
  
  useEffect(() => {
    const newUserId = searchParams.get('newUserId');
    
    if (newUserId) {
      console.log("New user detected:", newUserId);
      
      // Remove the parameter to prevent repeated handling
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('newUserId');
      navigate({ search: newSearchParams.toString() }, { replace: true });
      
      toast({
        title: "User added successfully",
        description: "Now you can assign a role to the new user."
      });
      
      // Find the new user and open role dialog
      fetchUsers().then((updatedUsers) => {
        const newUser = updatedUsers.find(u => u.id === newUserId);
        if (newUser) {
          handleOpenRoleDialog(newUser);
        } else {
          console.log("Fetching users again to find the new user");
          // If not found immediately, try again with a delay
          setTimeout(() => {
            fetchUsers().then((retryUsers) => {
              const newUserRetry = retryUsers.find(u => u.id === newUserId);
              if (newUserRetry) {
                handleOpenRoleDialog(newUserRetry);
              } else {
                console.warn("Couldn't find the newly created user");
                toast({
                  title: "User added",
                  description: "Please refresh the page to see the new user and assign roles manually."
                });
              }
            });
          }, 1500);
        }
      });
    }
  }, [searchParams, navigate, handleOpenRoleDialog, fetchUsers]);

  const handleAddUser = () => {
    // Open the create user dialog instead of redirecting to auth page
    if (isAdmin && createUser) {
      setShowCreateDialog(true);
    } else {
      // Fallback to old behavior if not admin or createUser not available
      console.log("Add User button clicked");
      // Save current URL to return to after user creation
      localStorage.setItem("authRedirectUrl", "/admin");
      navigate('/auth?tab=signup');
      
      toast({
        title: "Adding a new user",
        description: "Please complete the signup form to add a new user"
      });
    }
  };

  const handleCreateUser = async (email: string, password: string, role: UserRole, fullName: string) => {
    if (createUser) {
      const newUser = await createUser(email, password, role, fullName);
      if (newUser) {
        setShowCreateDialog(false);
        await fetchUsers();
        toast({
          title: "Success",
          description: `User ${email} created successfully with ${role} role.`
        });
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>User Management</CardTitle>
          <UserSearchBar 
            userSearchTerm={userSearchTerm}
            setUserSearchTerm={setUserSearchTerm}
            handleAddUser={handleAddUser}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <UserTable 
              filteredUsers={filteredUsers}
              isAdmin={isAdmin}
              handleOpenRoleDialog={handleOpenRoleDialog}
              handleDeleteUser={handleDeleteUser}
              handleQuickRoleChange={handleQuickRoleChange}
            />
          )}
          
          <UserTablePagination 
            filteredUsersCount={filteredUsers.length}
            totalUsersCount={users.length}
          />
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

      <CreateUserDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateUser={handleCreateUser}
      />
    </>
  );
};

export default UserManagement;
