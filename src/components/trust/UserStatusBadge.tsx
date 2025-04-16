
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { SafeUserTrust } from '@/components/trust/types';

interface UserStatusBadgeProps {
  user: SafeUserTrust;
}

export const UserStatusBadge = ({ user }: UserStatusBadgeProps) => {
  if (user.is_suspended) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" /> Suspended
      </Badge>
    );
  } else if (user.warning_count > 0) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" /> Warned ({user.warning_count})
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-green-100 border-green-300 text-green-800">
        <CheckCircle2 className="h-3 w-3" /> Good Standing
      </Badge>
    );
  }
};
