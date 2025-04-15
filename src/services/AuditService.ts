
import { supabase } from "@/integrations/supabase/client";
import { AuditLog } from "./types/rbac";

// Get audit logs (admin only or ops team member's own logs)
export const getAuditLogs = async (options?: { 
  userId?: string,
  resourceType?: string,
  limit?: number
}): Promise<AuditLog[]> => {
  let query = supabase
    .from('audit_logs')
    .select(`
      id,
      user_id,
      action,
      resource_type,
      resource_id,
      details,
      created_at,
      profiles!user_id (
        full_name
      )
    `);

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  if (options?.resourceType) {
    query = query.eq('resource_type', options.resourceType);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return data.map(item => {
    // Check if profiles is a valid object before accessing its properties
    const user = typeof item.profiles === 'object' && item.profiles !== null
      ? {
          // Add null fallbacks and type guards
          full_name: typeof item.profiles === 'object' && item.profiles !== null && 'full_name' in item.profiles ? 
            String(item.profiles.full_name || '') : ''
        }
      : undefined;
    
    return {
      ...item,
      // Convert details from Json to Record<string, any>
      details: item.details as Record<string, any> | null,
      user
    };
  }) || [];
};

// Log an audit event
export const logAuditEvent = async (
  action: string,
  resourceType: string,
  resourceId?: string | null,
  details?: Record<string, any>
): Promise<boolean> => {
  try {
    await supabase.rpc('log_audit_event', { 
      action, 
      resource_type: resourceType, 
      resource_id: resourceId, 
      details
    });
    return true;
  } catch (error) {
    console.error('Error logging audit event:', error);
    return false;
  }
};
