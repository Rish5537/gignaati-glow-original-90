
import { supabase } from "@/integrations/supabase/client";
import { AuditLog } from "./types/rbac";

// Log an audit event
export const logAuditEvent = async (
  action: string,
  resourceType: string,
  resourceId: string | null,
  details: any
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .rpc('log_audit_event', { 
        action, 
        resource_type: resourceType, 
        resource_id: resourceId, 
        details 
      });

    if (error) {
      console.error('Error logging audit event:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error logging audit event:', error);
    return null;
  }
};

// Get all audit logs
export const getAuditLogs = async (
  params: { limit?: number, offset?: number } = {}
): Promise<AuditLog[]> => {
  const limit = params.limit ?? 50;
  const offset = params.offset ?? 0;
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, profiles:user_id(*)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return data.map(log => {
    // Safe access to profiles data with proper type handling
    const userData = log.profiles as Record<string, any> | null;
    
    return {
      id: log.id,
      action: log.action,
      resource_type: log.resource_type,
      resource_id: log.resource_id,
      user_id: log.user_id,
      details: log.details as Record<string, any> | null,
      created_at: log.created_at,
      user: userData ? {
        full_name: userData.full_name as string || '',
        avatar_url: userData.avatar_url as string | null
      } : undefined
    };
  });
};
