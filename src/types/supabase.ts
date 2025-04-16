
export interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  icon_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  type: 'country' | 'state' | 'city';
  parent_id: string | null;
  launch_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Dispute {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  reporter_id: string;
  assignee_id: string | null;
  resolution: string | null;
  related_entity_type: 'gig' | 'order' | 'user' | 'payment';
  related_entity_id: string;
  created_at: string;
  updated_at: string;
  reporter_profile?: {
    full_name: string;
    avatar_url: string | null;
    username: string | null;
  };
  assignee_profile?: {
    full_name: string;
    avatar_url: string | null;
    username: string | null;
  };
}

export interface DisputeEvent {
  id: string;
  dispute_id: string;
  type: string;
  content: string;
  user_id: string;
  created_at: string;
  user_profile?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface FlaggedContent {
  id: string;
  content_type: string;
  content_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  resolution?: string | null;
  created_at: string;
  updated_at?: string;
  assignee_id?: string | null;
  content_preview?: string;
  reporter_name?: string;
}

export interface UserTrust {
  id: string;
  user_id: string;
  trust_score: number;
  warning_count: number;
  suspension_count: number;
  is_suspended: boolean;
  suspension_reason: string | null;
  suspension_until: string | null;
  last_warning_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string;
    avatar_url: string | null;
    username: string | null;
  };
}
