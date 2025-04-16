
import { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface KRA {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpsAssignment {
  id: string;
  user_id: string;
  kra_id: string;
  created_at: string;
  updated_at: string;
  kra?: KRA;
}

export interface OpsTask {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee_id: string | null;
  kra_id: string | null;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  escalated_to: string | null;
  escalation_reason: string | null;
  escalation_count: number | null;
  assignee?: {
    full_name: string;
    avatar_url: string | null;
  };
  kra?: KRA;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
  user?: {
    full_name: string;
  };
}
