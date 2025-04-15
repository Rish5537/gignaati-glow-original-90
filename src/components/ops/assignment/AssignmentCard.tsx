
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import { OpsAssignment, KRA } from "@/services/types/rbac";

interface AssignmentCardProps {
  userId: string;
  fullName: string | null;
  assignments: OpsAssignment[];
  kras: KRA[];
  onRemoveAssignment: (assignmentId: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  userId,
  fullName,
  assignments,
  kras,
  onRemoveAssignment,
}) => {
  return (
    <div key={userId} className="border rounded-md p-4">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
          {fullName?.charAt(0) || "U"}
        </div>
        <div className="font-medium">{fullName || "Unknown User"}</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-500">Assigned KRAs:</div>
        <div className="space-y-2">
          {assignments.map((assignment) => {
            const kra = kras.find((k) => k.id === assignment.kra_id);

            return (
              <div
                key={assignment.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
              >
                <div>
                  <div className="font-medium">{kra?.name || "Unknown KRA"}</div>
                  {kra?.description && (
                    <div className="text-sm text-gray-500">{kra.description}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveAssignment(assignment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
