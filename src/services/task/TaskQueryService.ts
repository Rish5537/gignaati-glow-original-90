
import { supabase } from "@/integrations/supabase/client";

// Get tasks by status
export const getTasksByStatus = async (status: string, kraId?: string) => {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      assignee:assignee_id(id, full_name, avatar_url),
      kra:kra_id(id, name)
    `)
    .eq('status', status);

  if (kraId) {
    query = query.eq('kra_id', kraId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tasks by status:', error);
    return [];
  }

  return data || [];
};

// Get task by id
export const getTaskById = async (id: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:assignee_id(id, full_name, avatar_url),
      reporter:reporter_id(id, full_name, avatar_url),
      kra:kra_id(id, name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching task by id:', error);
    return null;
  }

  return data;
};

// Get tasks by assignee
export const getTasksByAssignee = async (assigneeId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:assignee_id(id, full_name, avatar_url),
      reporter:reporter_id(id, full_name, avatar_url),
      kra:kra_id(id, name)
    `)
    .eq('assignee_id', assigneeId);

  if (error) {
    console.error('Error fetching tasks by assignee:', error);
    return [];
  }

  return data || [];
};

// Get task count by status
export const getTaskCountByStatus = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('status', { count: 'exact', head: false })
    .limit(1);

  if (error) {
    console.error('Error fetching task count by status:', error);
    return {};
  }

  // Count would be in the response as data.count
  return data || {};
};
