
import React from "react";
import { OpsAssignment, KRA } from "@/services/types/rbac";
import AssignmentCard from "./AssignmentCard";

interface User {
  id: string;
  full_name: string | null;
}

interface GroupedAssignments {
  [key: string]: {
    user_id: string;
    full_name: string | null;
    assignments: OpsAssignment[];
  };
}

interface AssignmentListProps {
  assignments: OpsAssignment[];
  kras: KRA[];
  opsTeamMembers: User[];
  isLoading: boolean;
  onRemoveAssignment: (assignmentId: string) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  kras,
  opsTeamMembers,
  isLoading,
  onRemoveAssignment,
}) => {
  // Group assignments by user_id for display
  const groupedAssignments: GroupedAssignments = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.user_id]) {
      const user = opsTeamMembers.find((u) => u.id === assignment.user_id);
      acc[assignment.user_id] = {
        user_id: assignment.user_id,
        full_name: user?.full_name || null,
        assignments: [],
      };
    }

    acc[assignment.user_id].assignments.push(assignment);
    return acc;
  }, {} as GroupedAssignments);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (Object.values(groupedAssignments).length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No assignments found</h3>
        <p className="text-gray-500 mt-2">
          Click "Assign KRA" to assign Key Responsibility Areas to ops team members.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.values(groupedAssignments).map(({ user_id, full_name, assignments }) => (
        <AssignmentCard
          key={user_id}
          userId={user_id}
          fullName={full_name}
          assignments={assignments}
          kras={kras}
          onRemoveAssignment={onRemoveAssignment}
        />
      ))}
    </div>
  );
};

export default AssignmentList;
