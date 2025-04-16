
import React from 'react';
import { UserItem } from './UserItem';
import { SafeUserTrust } from './types';

interface UserListProps {
  users: SafeUserTrust[];
  handleWarnUser: (userId: string, reason: string) => Promise<void>;
  handleSuspendUser: (userId: string, reason: string, days: number) => Promise<void>;
  handleRemoveSuspension: (user: SafeUserTrust) => Promise<void>;
}

export const UserList = ({ 
  users, 
  handleWarnUser, 
  handleSuspendUser,
  handleRemoveSuspension 
}: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No user trust data found matching the current filters.
      </div>
    );
  }

  return (
    <>
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          handleWarnUser={handleWarnUser}
          handleSuspendUser={handleSuspendUser}
          handleRemoveSuspension={handleRemoveSuspension}
        />
      ))}
    </>
  );
};
