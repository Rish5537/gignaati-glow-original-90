
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface GigSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const GigSearchBar: React.FC<GigSearchBarProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search gigs..."
        className="max-w-xs"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-1" />
        Filter
      </Button>
    </div>
  );
};

export default GigSearchBar;
