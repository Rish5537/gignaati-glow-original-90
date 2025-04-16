
import React from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserListHeaderProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  toggleSort: (field: string) => void;
}

export const UserListHeader = ({ 
  statusFilter, 
  setStatusFilter, 
  toggleSort 
}: UserListHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">User Trust & Safety Controls</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="warned">Warned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted/50">
          <div className="col-span-4 flex items-center gap-1">
            User
          </div>
          <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('trust_score')}>
            Trust Score
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 hidden md:flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('warning_count')}>
            Warnings
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-2 hidden lg:flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('status')}>
            Status
            <ArrowUpDown className="h-3 w-3" />
          </div>
          <div className="col-span-4 md:col-span-2 flex justify-end">
            Actions
          </div>
        </div>
      </div>
    </div>
  );
};
