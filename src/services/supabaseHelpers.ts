
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "./types/rbac";
import { Session, User } from "@supabase/supabase-js";

/**
 * Helper function to check if a user has a specific role
 */
export const checkUserHasRole = async (userId: string, role: UserRole): Promise<boolean> => {
  const { data, error } = await supabase.rpc('has_role', { 
    user_id: userId,
    required_role: role
  });
  
  if (error) {
    console.error("Error checking user role:", error);
    return false;
  }
  
  return !!data;
};

/**
 * Helper function to get the current user session
 */
export const getCurrentSession = async (): Promise<Session | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Helper function to get the current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getCurrentSession();
  return session?.user || null;
};

/**
 * Helper function to insert or update a profile
 */
export const upsertProfile = async (profile: {
  id: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();
    
  if (error) {
    console.error("Error upserting profile:", error);
    throw error;
  }
  
  return data;
};
