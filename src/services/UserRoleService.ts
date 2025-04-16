
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "./types/rbac";

/**
 * Assign a role to a user
 */
export const assignRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // First check if role already exists
    const { data: existingRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', role);
    
    // If role already assigned, return true
    if (existingRoles && existingRoles.length > 0) {
      return true;
    }
    
    // Insert new role
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role
      });
    
    if (error) {
      console.error('Error assigning role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in assignRole:', error);
    return false;
  }
};

/**
 * Remove a role from a user
 */
export const removeRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    if (error) {
      console.error('Error removing role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeRole:', error);
    return false;
  }
};

/**
 * Get all roles for a user
 */
export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
    
    return data.map(item => item.role);
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return [];
  }
};

/**
 * Check if a user has a specific role
 */
export const hasRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('has_role', { 
      user_id: userId,
      required_role: role
    });
    
    if (error) {
      console.error('Error checking role:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in hasRole:', error);
    return false;
  }
};

/**
 * Set a single role for a user (removes all other roles)
 */
export const setRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // First delete all current roles
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    // Then assign the new role
    return await assignRole(userId, role);
  } catch (error) {
    console.error('Error in setRole:', error);
    return false;
  }
};
