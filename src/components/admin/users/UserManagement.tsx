
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserRoleDialog from "./UserRoleDialog";
import UserTable from "./UserTable";
import UserSearchBar from "./UserSearchBar";
import UserTablePagination from "./UserTablePagination";
import { useUserManagement } from "./useUserManagement";

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
  const { user, isAdmin } = useAuth();

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);
  
  // Check for newly added user via URL search params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newUserId = queryParams.get('newUserId');
    
    if (newUserId) {
      // Clear the URL parameter
      navigate('/admin', { replace: true });
      
      // Refresh users list to include the new user
      fetchUsers().then(() => {
        // Find the new user and open role dialog
        const newUser = users.find(u => u.id === newUserId);
        if (newUser) {
          handleOpenRoleDialog(newUser);
        }
      });
    }
  }, [location.search]);

  // Handle add new user
  const handleAddUser = () => {
    // Save redirect URL to return after auth
    localStorage.setItem("authRedirectUrl", "/admin");
    // Redirect to auth page
    navigate('/auth');
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
