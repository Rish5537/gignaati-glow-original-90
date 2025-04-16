
import { User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'buyer' | 'creator' | 'ops_team' | 'moderator';

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  profiles?: {
    id: string;
    full_name: string;
  };
}

export interface UserWithRoles extends User {
  roles?: UserRole[];
}

export interface KRA {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface OpsAssignment {
  id: string;
  user_id: string;
  kra_id: string;
  created_at: string;
  updated_at?: string;
  kra?: KRA;
}

export interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  user_id: string;
  details?: Record<string, any>;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}
