
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserRoleDialog from "./UserRoleDialog";
import UserTable from "./UserTable";
import UserSearchBar from "./UserSearchBar";
import UserTablePagination from "./UserTablePagination";
import { useUserManagement } from "./useUserManagement";
import { toast } from "@/hooks/use-toast";

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
    handleDeleteUser
  } = useUserManagement();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);
  
  // Check for newly added user via URL search params
  useEffect(() => {
    const newUserId = searchParams.get('newUserId');
    
    if (newUserId) {
      console.log("New user detected:", newUserId);
      
      // Clear the URL parameter without navigating
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('newUserId');
      navigate({ search: newSearchParams.toString() }, { replace: true });
      
      // Show success toast
      toast({
        title: "User added successfully",
        description: "Now you can assign a role to the new user."
      });
      
      // Refresh users list to include the new user
      fetchUsers().then(() => {
        // Find the new user and open role dialog
        const newUser = users.find(u => u.id === newUserId);
        if (newUser) {
          handleOpenRoleDialog(newUser);
        } else {
          console.log("Fetching users again to find the new user");
          // Retry once more after a delay
          setTimeout(() => {
            fetchUsers().then(() => {
              const newUserRetry = users.find(u => u.id === newUserId);
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
          }, 1000);
        }
      });
    }
  }, [searchParams, navigate, users, handleOpenRoleDialog, fetchUsers]);

  // Handle add new user
  const handleAddUser = () => {
    console.log("Add User button clicked");
    // Save redirect URL to return after auth
    localStorage.setItem("authRedirectUrl", "/admin");
    // Redirect to auth page with signup tab
    navigate('/auth?tab=signup');
    
    toast({
      title: "Adding a new user",
      description: "Please complete the signup form to add a new user"
    });
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
    </>
  );
};

export default UserManagement;
