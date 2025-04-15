import { supabase } from "@/integrations/supabase/client";
import { OpsTask } from "./types/rbac";
import { logAuditEvent } from "./AuditService";

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

// Create a new task
export const createTask = async (task: Partial<OpsTask>): Promise<OpsTask | null> => {
  const { data, error } = await supabase
    .from('ops_tasks')
    .insert({
      title: task.title,
      description: task.description,
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      assignee_id: task.assignee_id,
      kra_id: task.kra_id,
      due_date: task.due_date
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  // Log audit event
  await logAuditEvent(
    'create_task', 
    'ops_tasks', 
    data.id, 
    { title: task.title }
  );

  // Type cast to ensure status and priority are properly typed
  const result: OpsTask = {
    ...data,
    status: data.status as 'pending' | 'in_progress' | 'completed' | 'escalated',
    priority: data.priority as 'low' | 'medium' | 'high' | 'critical'
  };

  return result;
};

// Update a task
export const updateTask = async (taskId: string, updates: Partial<OpsTask>): Promise<boolean> => {
  const { error } = await supabase
    .from('ops_tasks')
    .update({
      title: updates.title,
      description: updates.description,
      status: updates.status,
      priority: updates.priority,
      assignee_id: updates.assignee_id,
      kra_id: updates.kra_id,
      due_date: updates.due_date,
      escalated_to: updates.escalated_to,
      escalation_reason: updates.escalation_reason,
      escalation_count: updates.escalation_count
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task:', error);
    return false;
  }

  // Log audit event
  await logAuditEvent(
    'update_task', 
    'ops_tasks', 
    taskId, 
    { updates }
  );

  return true;
};

// Escalate a task (for ops team members)
export const escalateTask = async (
  taskId: string, 
  escalatedTo: string, 
  reason: string
): Promise<boolean> => {
  const { data: task, error: fetchError } = await supabase
    .from('ops_tasks')
    .select('escalation_count')
    .eq('id', taskId)
    .single();

  if (fetchError) {
    console.error('Error fetching task:', fetchError);
    return false;
  }

  const { error } = await supabase
    .from('ops_tasks')
    .update({
      status: 'escalated',
      escalated_to: escalatedTo,
      escalation_reason: reason,
      escalation_count: (task.escalation_count || 0) + 1
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error escalating task:', error);
    return false;
  }

  // Log audit event
  await logAuditEvent(
    'escalate_task', 
    'ops_tasks', 
    taskId, 
    { 
      escalated_to: escalatedTo, 
      reason 
    }
  );

  return true;
};
