
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
import { Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SafeUserTrust } from '../types';

interface SuspendDialogProps {
  user: SafeUserTrust;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspendUser: (reason: string, days: number) => Promise<void>;
}

export const SuspendDialog = ({ user, open, onOpenChange, onSuspendUser }: SuspendDialogProps) => {
  const [actionReason, setActionReason] = useState('');
  const [suspensionDays, setSuspensionDays] = useState(1);

  const handleSuspend = async () => {
    if (!actionReason.trim()) return;
    await onSuspendUser(actionReason, suspensionDays);
    setActionReason('');
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Suspend User</DialogTitle>
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
            <div className="text-sm text-muted-foreground">Previous Suspensions: {user.suspension_count}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="suspensionDays">Suspension Duration (Days)</Label>
          <Select
            value={suspensionDays.toString()}
            onValueChange={(value) => setSuspensionDays(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 day</SelectItem>
              <SelectItem value="3">3 days</SelectItem>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="suspensionReason">Suspension Reason (Required)</Label>
          <Textarea
            id="suspensionReason"
            placeholder="Enter the reason for this suspension..."
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
          variant="destructive" 
          onClick={handleSuspend}
          disabled={!actionReason.trim()}
          className="flex items-center gap-1"
        >
          <Shield className="h-4 w-4" /> Suspend User
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
