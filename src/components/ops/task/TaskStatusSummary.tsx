
import React from "react";

interface TaskStatusSummaryProps {
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
}

const TaskStatusSummary: React.FC<TaskStatusSummaryProps> = ({
  totalCount,
  pendingCount,
  inProgressCount,
  completedCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Total Tasks</div>
        <div className="text-2xl font-bold">{totalCount}</div>
      </div>
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Pending</div>
        <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
      </div>
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">In Progress</div>
        <div className="text-2xl font-bold text-blue-500">{inProgressCount}</div>
      </div>
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Completed</div>
        <div className="text-2xl font-bold text-green-500">{completedCount}</div>
      </div>
    </div>
  );
};

export default TaskStatusSummary;
