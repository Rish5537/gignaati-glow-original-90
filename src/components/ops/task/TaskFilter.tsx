
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KRA } from "@/services/types/rbac";

interface TaskFilterProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  kraFilter: string;
  setKraFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  kras: KRA[];
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  statusFilter,
  setStatusFilter,
  kraFilter,
  setKraFilter,
  searchQuery,
  setSearchQuery,
  kras,
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="md:w-1/3"
      />
      
      <div className="flex space-x-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={kraFilter} onValueChange={setKraFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by KRA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All KRAs</SelectItem>
            {kras.map(kra => (
              <SelectItem key={kra.id} value={kra.id}>
                {kra.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TaskFilter;
