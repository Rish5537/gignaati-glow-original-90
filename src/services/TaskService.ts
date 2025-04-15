
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
    .select(`
      id,
      title,
      description,
      status,
      priority,
      assignee_id,
      kra_id,
      created_at,
      updated_at,
      due_date,
      escalated_to,
      escalation_reason,
      escalation_count,
      profiles!assignee_id (
        full_name,
        avatar_url
      ),
      kras!kra_id (
        id,
        name,
        description,
        created_at,
        updated_at
      )
    `);

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
    
    // Check if profiles is a valid object before accessing its properties
    const assignee = typeof item.profiles === 'object' && item.profiles !== null 
      ? {
          // Add null fallbacks and type guards
          full_name: typeof item.profiles === 'object' && item.profiles !== null && 'full_name' in item.profiles ? 
            String(item.profiles.full_name || '') : '',
          avatar_url: typeof item.profiles === 'object' && item.profiles !== null && 'avatar_url' in item.profiles ? 
            (item.profiles.avatar_url as string | null) : null
        }
      : undefined;
    
    return {
      ...item,
      status,
      priority,
      assignee,
      kra: item.kras ? {
        id: item.kras.id,
        name: item.kras.name,
        description: item.kras.description,
        created_at: item.kras.created_at,
        updated_at: item.kras.updated_at
      } : undefined
    };
  }) || [];
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
