
import React from "react";
import { AlertCircle } from "lucide-react";
import { OpsTask } from "@/services/types/rbac";
import TaskItem from "./TaskItem";

interface TaskListProps {
  isLoading: boolean;
  tasks: OpsTask[];
  filteredTasks: OpsTask[];
  onViewTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  isLoading, 
  tasks, 
  filteredTasks, 
  onViewTask 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-gray-500 mt-2">
          {tasks.length > 0 
            ? "Try adjusting your filters to see more results." 
            : "No tasks have been created yet."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onViewTask={onViewTask} 
        />
      ))}
    </div>
  );
};

export default TaskList;
