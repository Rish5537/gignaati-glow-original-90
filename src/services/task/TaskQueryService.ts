
import { supabase } from "@/integrations/supabase/client";
import { OpsTask } from "../types/rbac";

// Get tasks for ops team member or by KRA
export const getOpsTasks = async (options?: { 
  userId?: string, 
  kraId?: string,
  status?: string
}): Promise<OpsTask[]> => {
  let query = supabase
    .from('ops_tasks')
    .select('*, profiles:assignee_id(*), kras:kra_id(*)');

  if (options?.userId) {
    query = query.eq('assignee_id', options.userId);
  }

  if (options?.kraId) {
    query = query.eq('kra_id', options.kraId);
  }
  
  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query.order('priority', { ascending: false });

  if (error) {
    console.error('Error fetching ops tasks:', error);
    return [];
  }

  return data.map(item => {
    // Ensure status is strictly typed
    const status = item.status as 'pending' | 'in_progress' | 'completed' | 'escalated';
    const priority = item.priority as 'low' | 'medium' | 'high' | 'critical';
    
    // Type check and safely access profiles 
    const profileData = item.profiles as Record<string, any> | null;
    const kraData = item.kras as Record<string, any> | null;
    
    return {
      ...item,
      status,
      priority,
      assignee: profileData ? {
        full_name: profileData.full_name as string || '',
        avatar_url: profileData.avatar_url as string | null
      } : undefined,
      kra: kraData ? {
        id: kraData.id,
        name: kraData.name,
        description: kraData.description,
        created_at: kraData.created_at,
        updated_at: kraData.updated_at
      } : undefined
    };
  });
};
