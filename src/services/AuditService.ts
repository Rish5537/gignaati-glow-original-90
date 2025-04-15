
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
    // Type check and safely access profiles 
    const profilesData = item.profiles;
    let user;
    
    if (profilesData && typeof profilesData === 'object' && profilesData !== null) {
      // Only add the user property if profilesData exists and has a full_name property
      const fullName = 'full_name' in profilesData ? String(profilesData.full_name || '') : '';
      
      user = {
        full_name: fullName
      };
    }
    
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
