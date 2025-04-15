
import { supabase } from "@/integrations/supabase/client";
import { KRA, OpsAssignment, OpsTask, AuditLog } from "./types/rbac";

// Get all KRAs
export const getAllKRAs = async (): Promise<KRA[]> => {
  const { data, error } = await supabase
    .from('kras')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching KRAs:', error);
    return [];
  }

  return data || [];
};

// Get ops team assignments
export const getOpsAssignments = async (userId?: string): Promise<OpsAssignment[]> => {
  let query = supabase
    .from('ops_assignments')
    .select(`
      id,
      user_id,
      kra_id,
      created_at,
      updated_at,
      kras (
        id,
        name,
        description
      )
    `);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching ops assignments:', error);
    return [];
  }

  return data.map(item => ({
    ...item,
    kra: item.kras
  })) || [];
};

// Assign KRA to ops team member (admin only)
export const assignKRA = async (userId: string, kraId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('ops_assignments')
    .insert({ user_id: userId, kra_id: kraId });

  if (error) {
    console.error('Error assigning KRA:', error);
    return false;
  }

  // Log audit event
  await logAuditEvent(
    'assign_kra', 
    'ops_assignments', 
    null, 
    { user_id: userId, kra_id: kraId }
  );

  return true;
};

// Remove KRA assignment from ops team member (admin only)
export const removeKRAAssignment = async (assignmentId: string): Promise<boolean> => {
  const { data: assignment, error: fetchError } = await supabase
    .from('ops_assignments')
    .select('*')
    .eq('id', assignmentId)
    .single();

  if (fetchError) {
    console.error('Error fetching assignment:', fetchError);
    return false;
  }

  const { error } = await supabase
    .from('ops_assignments')
    .delete()
    .eq('id', assignmentId);

  if (error) {
    console.error('Error removing KRA assignment:', error);
    return false;
  }

  // Log audit event
  await logAuditEvent(
    'remove_kra_assignment', 
    'ops_assignments', 
    null, 
    { 
      user_id: assignment.user_id, 
      kra_id: assignment.kra_id 
    }
  );

  return true;
};

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
        description
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

  return data.map(item => ({
    ...item,
    assignee: item.profiles,
    kra: item.kras
  })) || [];
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

  return data;
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

  return data.map(item => ({
    ...item,
    user: item.profiles
  })) || [];
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
