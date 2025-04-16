import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText,
  MessageCircle,
  History,
  FilePlus
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dispute, DisputeEvent } from '@/types/supabase';

interface DisputeDetailProps {
  dispute: Dispute;
  onClose: () => void;
}

const DisputeDetail = ({ dispute, onClose }: DisputeDetailProps) => {
  const [updatedDispute, setUpdatedDispute] = useState<Dispute>(dispute);
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  const [resolution, setResolution] = useState(dispute.resolution || '');
  const [newStatus, setNewStatus] = useState(dispute.status);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeline, setTimeline] = useState<DisputeEvent[]>([]);
  const { toast } = useToast();

  const fetchTimelineEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('dispute_events')
        .select(`
          *,
          user_profile:profiles!user_id(*)
        `)
        .eq('dispute_id', dispute.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setTimeline(data || []);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dispute timeline',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    fetchTimelineEvents();
  }, [dispute.id]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error: commentError } = await supabase
        .from('dispute_events')
        .insert({
          dispute_id: dispute.id,
          type: 'comment',
          content: comment,
          user_id: 'current-user-id', // Replace with actual current user id
        });
        
      if (commentError) throw commentError;

      setComment('');
      fetchTimelineEvents();
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been added to the dispute.',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (newStatus === dispute.status && (!resolution || resolution === dispute.resolution)) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const updates: any = { status: newStatus };
      
      if (resolution && resolution !== dispute.resolution) {
        updates.resolution = resolution;
      }
      
      const { error: updateError, data: updatedData } = await supabase
        .from('disputes')
        .update(updates)
        .eq('id', dispute.id)
        .select()
        .single();
        
      if (updateError) throw updateError;

      const { error: eventError } = await supabase
        .from('dispute_events')
        .insert({
          dispute_id: dispute.id,
          type: 'status_change',
          content: `Status changed from ${dispute.status} to ${newStatus}${resolution ? ' with resolution' : ''}`,
          user_id: 'current-user-id', // Replace with actual current user id
        });
        
      if (eventError) throw eventError;

      setUpdatedDispute({
        ...updatedDispute,
        ...updates
      });
      
      fetchTimelineEvents();
      
      toast({
        title: 'Dispute updated',
        description: `Dispute status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating dispute:', error);
      toast({
        title: 'Error',
        description: 'Failed to update dispute',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'closed':
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (status) {
      case 'pending':
        return "destructive";
      case 'in_progress':
        return "secondary";
      case 'resolved':
        return "default";
      case 'closed':
      default:
        return "outline";
    }
  };

  const getPriorityVariant = (priority: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (priority) {
      case 'high':
        return "destructive";
      case 'medium':
        return "secondary";
      case 'low':
      default:
        return "outline";
    }
  };

  const getTimelineEventIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="h-4 w-4" />;
      case 'status_change':
        return <History className="h-4 w-4" />;
      case 'attachment':
        return <FilePlus className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disputes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{updatedDispute.title}</CardTitle>
              <CardDescription>
                Reported on {format(new Date(updatedDispute.created_at), 'MMMM d, yyyy')} • 
                ID: {updatedDispute.id.substring(0, 8)}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getPriorityVariant(updatedDispute.priority)} className="capitalize">
                {updatedDispute.priority} Priority
              </Badge>
              <Badge variant={getStatusVariant(updatedDispute.status)} className="flex items-center gap-1">
                {getStatusIcon(updatedDispute.status)}
                <span className="capitalize">{updatedDispute.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-base">{updatedDispute.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Reported By</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={updatedDispute.reporter_profile?.avatar_url || ''} />
                        <AvatarFallback>
                          {(updatedDispute.reporter_profile?.full_name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {updatedDispute.reporter_profile?.full_name || 
                         updatedDispute.reporter_profile?.username || 
                         'Unknown User'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h3>
                    {updatedDispute.assignee_id ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={updatedDispute.assignee_profile?.avatar_url || ''} />
                          <AvatarFallback>
                            {(updatedDispute.assignee_profile?.full_name || 'A').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {updatedDispute.assignee_profile?.full_name || 
                           updatedDispute.assignee_profile?.username || 
                           'Unknown User'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Not assigned</div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Related To</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {updatedDispute.related_entity_type}
                    </Badge>
                    <span className="text-sm">ID: {updatedDispute.related_entity_id.substring(0, 8)}</span>
                  </div>
                </div>

                {updatedDispute.resolution && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Resolution</h3>
                      <p>{updatedDispute.resolution}</p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {timeline.length > 0 ? (
                    timeline.map((event) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            {getTimelineEventIcon(event.type)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {event.user_profile?.full_name || 'User'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(event.created_at), 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>
                          <div className="text-sm">
                            {event.content}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No timeline events found for this dispute.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="actions" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Update Status</Label>
                  <Select 
                    value={newStatus} 
                    onValueChange={setNewStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(newStatus === 'resolved' || newStatus === 'closed') && (
                  <div>
                    <Label htmlFor="resolution">Resolution</Label>
                    <Textarea
                      id="resolution"
                      placeholder="Provide resolution details..."
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <Button 
                    onClick={handleUpdateStatus} 
                    disabled={isSubmitting || (newStatus === dispute.status && (!resolution || resolution === dispute.resolution))}
                    className="w-full"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Dispute'}
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="comment">Add Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Type your comment here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Button 
                    onClick={handleAddComment} 
                    disabled={isSubmitting || !comment.trim()} 
                    variant="outline" 
                    className="w-full"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Comment'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DisputeDetail;
