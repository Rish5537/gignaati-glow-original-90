
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserRoleSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const UserRoleSearch: React.FC<UserRoleSearchProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default UserRoleSearch;
