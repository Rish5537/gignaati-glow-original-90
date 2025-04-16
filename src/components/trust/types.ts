
export interface UserProfile {
  full_name?: string | null;
  avatar_url?: string | null;
  username?: string | null;
}

export interface SafeUserTrust {
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
  profile?: UserProfile | null;
}
