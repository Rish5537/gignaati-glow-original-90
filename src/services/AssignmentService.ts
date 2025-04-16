
import { supabase } from "@/integrations/supabase/client";
import { KRA, OpsAssignment } from "./types/rbac";
import { logAuditEvent } from "./AuditService";

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
        description,
        created_at,
        updated_at
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
    kra: item.kras ? {
      id: item.kras.id,
      name: item.kras.name,
      description: item.kras.description,
      created_at: item.kras.created_at,
      updated_at: item.kras.updated_at
    } : undefined
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
