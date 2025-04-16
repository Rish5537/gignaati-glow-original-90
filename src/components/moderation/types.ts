
export interface FlaggedContentItem {
  id: string;
  content_type: 'gig' | 'message' | 'profile' | 'review';
  content_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  resolution?: string | null;
  content_preview?: string;
  created_at: string;
  updated_at: string;
  reporter?: {
    full_name: string | null;
  } | null;
}

export interface EnhancedFlaggedContent extends FlaggedContentItem {
  content_preview: string;
  reporter_name: string;
}
