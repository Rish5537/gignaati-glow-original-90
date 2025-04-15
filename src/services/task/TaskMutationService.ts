
import { supabase } from "@/integrations/supabase/client";
import { OpsTask } from "../types/rbac";
import { logAuditEvent } from "../AuditService";

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
