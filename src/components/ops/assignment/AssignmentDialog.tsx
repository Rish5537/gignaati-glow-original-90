
import React from "react";
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
import { Button } from "@/components/ui/button";
import { KRA } from "@/services/types/rbac";

interface User {
  id: string;
  full_name: string | null;
}

interface AssignmentDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  opsTeamMembers: User[];
  kras: KRA[];
  selectedUser: string | null;
  setSelectedUser: (userId: string) => void;
  selectedKRA: string | null;
  setSelectedKRA: (kraId: string) => void;
  onAssignKRA: () => void;
}

const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  opsTeamMembers,
  kras,
  selectedUser,
  setSelectedUser,
  selectedKRA,
  setSelectedKRA,
  onAssignKRA,
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign KRA</DialogTitle>
          <DialogDescription>
            Assign a Key Responsibility Area to an operations team member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">User</label>
            <Select onValueChange={(value) => setSelectedUser(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {opsTeamMembers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">KRA</label>
            <Select onValueChange={(value) => setSelectedKRA(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a KRA" />
              </SelectTrigger>
              <SelectContent>
                {kras.map((kra) => (
                  <SelectItem key={kra.id} value={kra.id}>
                    {kra.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onAssignKRA}>Assign KRA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
