
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, UserPlus } from "lucide-react";

interface UserSearchBarProps {
  userSearchTerm: string;
  setUserSearchTerm: (term: string) => void;
  handleAddUser: () => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  userSearchTerm,
  setUserSearchTerm,
  handleAddUser,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search users..."
        className="max-w-xs"
        value={userSearchTerm}
        onChange={(e) => setUserSearchTerm(e.target.value)}
      />
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-1" />
        Filter
      </Button>
      <Button 
        className="bg-black hover:bg-gray-800"
        onClick={handleAddUser}
      >
        <UserPlus className="h-4 w-4 mr-1" />
        Add User
      </Button>
    </div>
  );
};

export default UserSearchBar;
