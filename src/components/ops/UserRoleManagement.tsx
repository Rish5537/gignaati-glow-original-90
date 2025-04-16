
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useUserRoleManagement } from "@/hooks/useUserRoleManagement";
import UserRoleDialog from "./user-roles/UserRoleDialog";
import UserRoleList from "./user-roles/UserRoleList";
import UserRoleSearch from "./user-roles/UserRoleSearch";

const UserRoleManagement = () => {
  const {
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
  } = useUserRoleManagement();

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
          <UserRoleSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          <UserRoleList 
            groupedRoles={groupedRoles}
            users={users}
            searchQuery={searchQuery}
            isLoading={isLoading}
            handleRemoveRole={handleRemoveRole}
          />
        </CardContent>
      </Card>
      
      <UserRoleDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        filteredUsers={filteredUsers}
        userSearchQuery={userSearchQuery}
        setUserSearchQuery={setUserSearchQuery}
        handleAddRole={handleAddRole}
      />
    </>
  );
};

export default UserRoleManagement;
