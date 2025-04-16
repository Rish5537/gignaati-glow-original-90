
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UserRoleAssignment } from "@/services/types/rbac";
import { User } from "@/hooks/useUserRoleManagement";

interface UserRoleListProps {
  groupedRoles: Record<string, UserRoleAssignment[]>;
  users: User[];
  searchQuery: string;
  isLoading: boolean;
  handleRemoveRole: (roleId: string) => void;
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  ops_team: "bg-blue-100 text-blue-800",
  creator: "bg-green-100 text-green-800",
  buyer: "bg-purple-100 text-purple-800",
  moderator: "bg-amber-100 text-amber-800",
};

const UserRoleList: React.FC<UserRoleListProps> = ({
  groupedRoles,
  users,
  searchQuery,
  isLoading,
  handleRemoveRole,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (Object.keys(groupedRoles).length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No user roles found</h3>
        <p className="text-gray-500 mt-2">
          Click "Assign Role" to add roles to users.
        </p>
      </div>
    );
  }

  return (
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
  );
};

export default UserRoleList;
