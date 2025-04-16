
import { supabase } from "@/integrations/supabase/client";
import { KRA } from "./types/rbac";
import { logAuditEvent } from "./AuditService";

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

// Create a new KRA
export const createKRA = async (name: string, description?: string): Promise<KRA | null> => {
  const { data, error } = await supabase
    .from('kras')
    .insert({
      name,
      description: description || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating KRA:', error);
    return null;
  }

  // Log audit event
  await logAuditEvent(
    'create_kra',
    'kras',
    data.id,
    { name, description }
  );

  return data;
};

// Update a KRA
export const updateKRA = async (id: string, name: string, description?: string): Promise<boolean> => {
  const { error } = await supabase
    .from('kras')
    .update({
      name,
      description: description || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating KRA:', error);
    return false;
  }

  // Log audit event
  await logAuditEvent(
    'update_kra',
    'kras',
    id,
    { name, description }
  );

  return true;
};

// Delete a KRA
export const deleteKRA = async (id: string): Promise<boolean> => {
  // First, get the KRA to log in the audit
  const { data: kra, error: fetchError } = await supabase
    .from('kras')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching KRA for deletion:', fetchError);
    return false;
  }

  const { error } = await supabase
    .from('kras')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting KRA:', error);
    return false;
  }

  // Log audit event
  await logAuditEvent(
    'delete_kra',
    'kras',
    id,
    { 
      name: kra.name,
      description: kra.description 
    }
  );

  return true;
};
