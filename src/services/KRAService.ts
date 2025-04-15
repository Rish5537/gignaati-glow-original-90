
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
