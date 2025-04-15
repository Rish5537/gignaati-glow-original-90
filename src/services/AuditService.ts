import { supabase } from "@/integrations/supabase/client";
import { AuditLog } from "./types/rbac";

// Log an audit event
export const logAuditEvent = async (
  action: string,
  resourceType: string,
  resourceId: string,
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
  limit: number = 50, 
  offset: number = 0
): Promise<AuditLog[]> => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      id,
      action,
      resource_type,
      resource_id,
      user_id,
      details,
      created_at,
      profiles!user_id (
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return data.map(log => {
    const profilesData = log.profiles;
    let user;
    
    if (profilesData && typeof profilesData === 'object') {
      const fullName = profilesData && 'full_name' in profilesData ? String(profilesData.full_name || '') : '';
      const avatarUrl = profilesData && 'avatar_url' in profilesData ? (profilesData.avatar_url as string | null) : null;
      
      user = {
        full_name: fullName,
        avatar_url: avatarUrl
      };
    }

    return {
      ...log,
      user
    };
  }) || [];
};
