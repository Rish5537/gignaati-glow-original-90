
import { supabase } from "@/integrations/supabase/client";
import { logAuditEvent } from "../AuditService";

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
