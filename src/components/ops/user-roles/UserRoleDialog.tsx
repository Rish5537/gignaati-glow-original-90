
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { UserRole } from "@/services/types/rbac";
import { User } from "@/hooks/useUserRoleManagement";

interface UserRoleDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  selectedUser: string | null;
  setSelectedUser: (userId: string) => void;
  selectedRole: UserRole | "";
  setSelectedRole: (role: UserRole | "") => void;
  filteredUsers: User[];
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  handleAddRole: () => void;
}

const UserRoleDialog: React.FC<UserRoleDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  selectedUser,
  setSelectedUser,
  selectedRole,
  setSelectedRole,
  filteredUsers,
  userSearchQuery,
  setUserSearchQuery,
  handleAddRole,
}) => {
  return (
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
  );
};

export default UserRoleDialog;
