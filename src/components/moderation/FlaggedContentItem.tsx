
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CheckCircle, X, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnhancedFlaggedContent } from './types';

interface FlaggedContentItemProps {
  item: EnhancedFlaggedContent;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
}

export const FlaggedContentItem = ({ item, handleApprove, handleReject }: FlaggedContentItemProps) => {
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'gig':
        return <Badge variant="outline" className="bg-blue-50">Gig</Badge>;
      case 'message':
        return <Badge variant="outline" className="bg-green-50">Message</Badge>;
      case 'profile':
        return <Badge variant="outline" className="bg-purple-50">Profile</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-orange-50">Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="destructive">Flag Approved</Badge>;
      case 'rejected':
        return <Badge variant="default">Flag Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-muted/30">
      <div className="col-span-4 space-y-1">
        <div className="flex items-center gap-2">
          {getContentTypeIcon(item.content_type)}
          <span className="text-sm font-medium truncate">ID: {item.content_id.substring(0, 8)}</span>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {item.content_preview}
        </div>
      </div>
      <div className="col-span-3 hidden md:block">
        <span className="text-sm truncate line-clamp-2">{item.reason}</span>
      </div>
      <div className="col-span-2 hidden lg:block">
        <span className="text-sm">{item.reporter_name}</span>
        <div className="text-xs text-muted-foreground">
          {format(new Date(item.created_at), 'MMM dd, yyyy')}
        </div>
      </div>
      <div className="col-span-3 md:col-span-2">
        {getStatusBadge(item.status)}
      </div>
      <div className="col-span-2 md:col-span-1 flex justify-end">
        {item.status === 'pending' ? (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => handleApprove(item.id)} title="Approve Flag">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleReject(item.id)} title="Reject Flag">
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleApprove(item.id)}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Approve Flag
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReject(item.id)}>
                <X className="h-4 w-4 mr-2 text-red-600" />
                Reject Flag
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
