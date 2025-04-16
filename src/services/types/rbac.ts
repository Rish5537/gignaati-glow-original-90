
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
