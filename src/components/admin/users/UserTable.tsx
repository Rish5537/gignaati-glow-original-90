
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCog, MessageSquare, Trash } from "lucide-react";
import { UserRole } from "@/services/types/rbac";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface UserTableProps {
  filteredUsers: any[];
  isAdmin: boolean;
  handleOpenRoleDialog: (user: any) => void;
  handleDeleteUser: (userId: string) => void;
  handleQuickRoleChange?: (userId: string, role: UserRole) => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({
  filteredUsers,
  isAdmin,
  handleOpenRoleDialog,
  handleDeleteUser,
  handleQuickRoleChange
}) => {
  const getUserDisplayName = (user: any) => {
    // If user has no full_name, use their email instead of "Unnamed User"
    if (!user.full_name || user.full_name.trim() === '') {
      // Extract email from user object or generate placeholder
      const email = user.email || user.username || `user-${user.id.substring(0, 6)}@example.com`;
      return email;
    }
    return user.full_name;
  };

  const getRoleClassName = (role: string) => {
    switch (role) {
      case 'admin': return "bg-red-100 text-red-800";
      case 'moderator': return "bg-blue-100 text-blue-800";
      case 'creator': return "bg-green-100 text-green-800";
      case 'ops_team': return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
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
                No users matching your search
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                      {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : (user.email?.substring(0, 2) || "??").toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">
                        {getUserDisplayName(user)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.username || 'No username'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {handleQuickRoleChange && isAdmin ? (
                    <Select
                      defaultValue={user.role || "buyer"}
                      onValueChange={(value) => handleQuickRoleChange(user.id, value as UserRole)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue placeholder="Assign Role">
                          <Badge className={getRoleClassName(user.role || "buyer")}>
                            {user.role || "buyer"}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="buyer">User</SelectItem>
                        <SelectItem value="ops_team">Ops</SelectItem>
                        <SelectItem value="creator">Creator</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getRoleClassName(user.role || "buyer")}>
                      {user.role || "buyer"}
                    </Badge>
                  )}
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
  );
};

export default UserTable;
