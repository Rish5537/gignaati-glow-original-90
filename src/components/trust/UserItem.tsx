
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { SafeUserTrust } from './types';
import { TrustScoreBadge } from './TrustScoreBadge';
import { UserStatusBadge } from './UserStatusBadge';
import { WarnDialog } from './dialogs/WarnDialog';
import { SuspendDialog } from './dialogs/SuspendDialog';

interface UserItemProps {
  user: SafeUserTrust;
  handleWarnUser: (userId: string, reason: string) => Promise<void>;
  handleSuspendUser: (userId: string, reason: string, days: number) => Promise<void>;
  handleRemoveSuspension: (user: SafeUserTrust) => Promise<void>;
}

export const UserItem = ({ 
  user, 
  handleWarnUser, 
  handleSuspendUser,
  handleRemoveSuspension 
}: UserItemProps) => {
  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  
  return (
    <div className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-muted/30">
      <div className="col-span-4 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.profile?.avatar_url || ''} />
          <AvatarFallback>
            {(user.profile?.full_name || 'U').charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{user.profile?.full_name || user.profile?.username || 'Unknown User'}</div>
          <div className="text-xs text-muted-foreground">ID: {user.user_id.substring(0, 8)}</div>
        </div>
      </div>
      
      <div className="col-span-2 flex items-center">
        <TrustScoreBadge score={user.trust_score} />
      </div>
      
      <div className="col-span-2 hidden md:flex items-center">
        <Badge variant="outline">
          {user.warning_count} warning{user.warning_count !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="col-span-2 hidden lg:flex items-center">
        <UserStatusBadge user={user} />
      </div>
      
      <div className="col-span-4 md:col-span-2 flex justify-end gap-2">
        {user.is_suspended ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRemoveSuspension(user)}
            className="flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" /> 
            Remove Suspension
          </Button>
        ) : (
          <>
            <WarnDialog 
              user={user} 
              open={warnDialogOpen} 
              onOpenChange={setWarnDialogOpen} 
              onWarnUser={(reason) => handleWarnUser(user.id, reason)}
            />
            
            <SuspendDialog
              user={user}
              open={suspendDialogOpen}
              onOpenChange={setSuspendDialogOpen}
              onSuspendUser={(reason, days) => handleSuspendUser(user.id, reason, days)}
            />
            
            <Dialog open={warnDialogOpen} onOpenChange={setWarnDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" /> 
                  Warn
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" /> 
                  Suspend
                </Button>
              </DialogTrigger>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};
