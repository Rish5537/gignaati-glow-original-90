
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SafeUserTrust } from '../types';

interface WarnDialogProps {
  user: SafeUserTrust;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWarnUser: (reason: string) => Promise<void>;
}

export const WarnDialog = ({ user, open, onOpenChange, onWarnUser }: WarnDialogProps) => {
  const [actionReason, setActionReason] = useState('');

  const handleWarn = async () => {
    if (!actionReason.trim()) return;
    await onWarnUser(actionReason);
    setActionReason('');
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Issue Warning</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profile?.avatar_url || ''} />
            <AvatarFallback>
              {(user.profile?.full_name || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.profile?.full_name || user.profile?.username || 'Unknown User'}</div>
            <div className="text-sm text-muted-foreground">Current Warnings: {user.warning_count}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="warnReason">Warning Reason (Required)</Label>
          <Textarea
            id="warnReason"
            placeholder="Enter the reason for this warning..."
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => {
          onOpenChange(false);
          setActionReason('');
        }}>Cancel</Button>
        <Button 
          onClick={handleWarn}
          disabled={!actionReason.trim()}
          className="flex items-center gap-1"
        >
          <AlertTriangle className="h-4 w-4" /> Issue Warning
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
