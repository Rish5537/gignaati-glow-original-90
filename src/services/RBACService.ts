
import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserRoleAssignment } from "./types/rbac";

// Get all roles for the current user
export const getCurrentUserRoles = async (): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', supabase.auth.getSession().then(({ data }) => data.session?.user.id));

  if (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }

  return data.map((item) => item.role);
};

// Check if current user has a specific role
export const hasRole = async (role: UserRole): Promise<boolean> => {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;
  
  if (!userId) {
    return false;
  }

  const { data, error } = await supabase.rpc('has_role', { 
    user_id: userId,
    required_role: role
  });

  if (error) {
    console.error('Error checking if user has role:', error);
    return false;
  }

  return data || false;
};

// Fetch all user roles (admin only)
export const getAllUserRoles = async (): Promise<UserRoleAssignment[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      id,
      user_id,
      role,
      created_at,
      updated_at
    `);

  if (error) {
    console.error('Error fetching all user roles:', error);
    return [];
  }

  return data || [];
};

// Assign a role to a user (admin only)
export const assignRole = async (userId: string, role: UserRole): Promise<boolean> => {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role });

  if (error) {
    console.error('Error assigning role:', error);
    return false;
  }

  return true;
};

// Remove a role from a user (admin only)
export const removeRole = async (roleId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', roleId);

  if (error) {
    console.error('Error removing role:', error);
    return false;
  }

  return true;
};
