
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "./types/rbac";

/**
 * Get the current user's roles
 */
export const getCurrentUserRoles = async (): Promise<UserRole[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }
  
  try {
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error fetching user roles:", error);
      return [];
    }
    
    return (roles || []).map(r => r.role as UserRole);
  } catch (error) {
    console.error("Error in getCurrentUserRoles:", error);
    return [];
  }
};

/**
 * Check if the current user has a specific role
 */
export const checkCurrentUserRole = async (requiredRole: UserRole): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  try {
    const { data, error } = await supabase.rpc('has_role', { 
      user_id: user.id,
      required_role: requiredRole
    });
    
    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkCurrentUserRole:", error);
    return false;
  }
};

/**
 * Check if a specific user has a specific role
 */
export const checkUserRole = async (userId: string, requiredRole: UserRole): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('has_role', { 
      user_id: userId,
      required_role: requiredRole
    });
    
    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkUserRole:", error);
    return false;
  }
};

/**
 * Assign a role to a user
 */
export const assignRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });
    
    if (error) {
      console.error("Error assigning role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in assignRole:", error);
    return false;
  }
};

/**
 * Remove a role from a user
 */
export const removeRole = async (roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', roleId);
    
    if (error) {
      console.error("Error removing role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in removeRole:", error);
    return false;
  }
};

/**
 * Get all user roles
 */
export const getAllUserRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        id,
        user_id,
        role,
        created_at,
        profiles!user_roles_user_id_fkey(full_name, username)
      `);
    
    if (error) {
      console.error("Error fetching all user roles:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllUserRoles:", error);
    return [];
  }
};
