
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface FlaggedContentHeaderProps {
  toggleSort: (field: string) => void;
}

export const FlaggedContentHeader = ({ toggleSort }: FlaggedContentHeaderProps) => {
  return (
    <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted/50">
      <div className="col-span-4 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('content_type')}>
        Content
        <ArrowUpDown className="h-3 w-3" />
      </div>
      <div className="col-span-3 hidden md:flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('reason')}>
        Reason
        <ArrowUpDown className="h-3 w-3" />
      </div>
      <div className="col-span-2 hidden lg:flex items-center gap-1" onClick={() => toggleSort('reporter_id')}>
        Reporter
        <ArrowUpDown className="h-3 w-3" />
      </div>
      <div className="col-span-3 md:col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('status')}>
        Status
        <ArrowUpDown className="h-3 w-3" />
      </div>
      <div className="col-span-2 md:col-span-1 flex justify-end">
        Actions
      </div>
    </div>
  );
};
