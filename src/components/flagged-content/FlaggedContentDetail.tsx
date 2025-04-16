
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FlaggedContent } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';

interface EnhancedFlaggedContent extends FlaggedContent {
  content_preview: string;
  reporter_name: string;
}

interface FlaggedContentDetailProps {
  content: EnhancedFlaggedContent;
  onClose: () => void;
  onAction: () => void;
}

const FlaggedContentDetail = ({ content, onClose, onAction }: FlaggedContentDetailProps) => {
  const [resolution, setResolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('flagged_content')
        .update({ 
          status: 'approved',
          resolution: resolution || 'Content flagged as inappropriate'
        })
        .eq('id', content.id);
        
      if (error) throw error;
      
      toast({
        title: 'Flag approved',
        description: 'The content has been flagged as inappropriate'
      });
      
      onAction();
    } catch (error) {
      console.error('Error approving flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve flag',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('flagged_content')
        .update({ 
          status: 'rejected',
          resolution: resolution || 'Content deemed appropriate after review' 
        })
        .eq('id', content.id);
        
      if (error) throw error;
      
      toast({
        title: 'Flag rejected',
        description: 'The content has been deemed appropriate'
      });
      
      onAction();
    } catch (error) {
      console.error('Error rejecting flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject flag',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContentTypeBadge = (type: string) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Flagged Content
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getContentTypeBadge(content.content_type)}
              <CardTitle>Content ID: {content.content_id.substring(0, 8)}</CardTitle>
            </div>
            <Badge variant="secondary">Reported by {content.reporter_name}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Content Preview</h3>
            <div className="p-4 border rounded-md bg-muted/10">
              {content.content_preview || 'No preview available'}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Reason for Flagging</h3>
            <div className="p-4 border rounded-md">
              {content.reason}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution Note (Optional)</Label>
            <Textarea
              id="resolution"
              placeholder="Add notes about your decision..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={handleApprove}
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" /> Approve Flag
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Reject Flag
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FlaggedContentDetail;
