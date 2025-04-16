
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserRoleDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  selectedUser: any;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  onAssignRole: () => void;
}

const UserRoleDialog: React.FC<UserRoleDialogProps> = ({
  showDialog,
  setShowDialog,
  selectedUser,
  selectedRole,
  setSelectedRole,
  onAssignRole
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Assigning role to:</p>
            <p className="font-medium">{selectedUser?.full_name || 'Unnamed User'}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Role</p>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            
            <p className="text-xs text-gray-500 mt-1">
              {selectedRole === 'admin' && 'Admins have full access to all features and settings.'}
              {selectedRole === 'moderator' && 'Moderators can review and manage content.'}
              {selectedRole === 'employee' && 'Employees have access to internal tools.'}
              {selectedRole === 'user' && 'Regular users with standard permissions.'}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowDialog(false)}
          >
            Cancel
          </Button>
          <Button onClick={onAssignRole}>
            Assign Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleDialog;
