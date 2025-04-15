
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, ArrowUpRight, CheckCircle } from "lucide-react";
import { OpsTask } from "@/services/types/rbac";

const statusIcons = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  in_progress: <ArrowUpRight className="h-4 w-4 text-blue-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  escalated: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  escalated: "bg-red-100 text-red-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  critical: "bg-red-100 text-red-800",
};

interface TaskItemProps {
  task: OpsTask;
  onViewTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onViewTask }) => {
  return (
    <div className="border rounded-md p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusColors[task.status as keyof typeof statusColors] || "bg-gray-100"}>
              <span className="flex items-center">
                {statusIcons[task.status as keyof typeof statusIcons]}
                <span className="ml-1 capitalize">{task.status}</span>
              </span>
            </Badge>
            
            <Badge className={priorityColors[task.priority as keyof typeof priorityColors] || "bg-gray-100"}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            {task.kra && (
              <Badge variant="outline">{task.kra.name}</Badge>
            )}
          </div>
          
          <h3 className="font-medium text-lg">{task.title}</h3>
          
          {task.description && (
            <p className="text-gray-500 text-sm line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center gap-x-4 text-sm text-gray-500">
            {task.assignee && (
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                  {task.assignee.full_name?.charAt(0) || "U"}
                </div>
                <span>{task.assignee.full_name}</span>
              </div>
            )}
            
            {task.due_date && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button onClick={() => onViewTask(task.id)}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
