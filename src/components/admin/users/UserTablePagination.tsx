
import React from "react";
import { Button } from "@/components/ui/button";

interface UserTablePaginationProps {
  filteredUsersCount: number;
  totalUsersCount: number;
}

const UserTablePagination: React.FC<UserTablePaginationProps> = ({
  filteredUsersCount,
  totalUsersCount,
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500">
        Showing {filteredUsersCount} of {totalUsersCount} users
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
};

export default UserTablePagination;
