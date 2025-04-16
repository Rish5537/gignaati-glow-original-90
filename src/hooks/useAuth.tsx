
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/services/types/rbac";
import { getUserRoles } from "@/services/UserRoleService";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  userRoles: UserRole[];
  isLoading: boolean;
  isAdmin: boolean;
  isOpsTeam: boolean;
  isCreator: boolean;
  isBuyer: boolean;
  isModerator: boolean;
  hasRole: (role: UserRole) => boolean;
  signOut: () => Promise<void>;
  canAccessAdminPanel: boolean;
  canAccessOpsPanel: boolean;
  canAccessClientDashboard: boolean;
  canAccessBrowseGigs: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Update state with session information
        setSession(session);
        setUser(session?.user ?? null);
        
        // If there's a valid user, fetch their roles
        if (session?.user) {
          // Use setTimeout to prevent recursion with Supabase client
          setTimeout(() => {
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setUserRoles([]);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      // Use direct service for fetching roles to avoid recursion issues
      const roles = await getUserRoles(userId);
      setUserRoles(roles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      setUserRoles([]);
    }
  };

  // Simple helper to check if user has a given role
  const hasRole = (role: UserRole) => {
    return userRoles.includes(role);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRoles([]);
  };

  // Compute access permissions
  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator');
  const isOpsTeam = hasRole('ops_team');
  const isCreator = hasRole('creator');
  const isBuyer = hasRole('buyer');
  
  // Define access permissions
  const canAccessAdminPanel = isAdmin || isModerator;
  const canAccessOpsPanel = isOpsTeam || isAdmin;
  const canAccessClientDashboard = true; // everyone can access this
  const canAccessBrowseGigs = true; // everyone can access this

  const value: AuthContextValue = {
    user,
    session,
    userRoles,
    isLoading,
    isAdmin,
    isOpsTeam,
    isCreator,
    isBuyer,
    isModerator,
    hasRole,
    signOut,
    canAccessAdminPanel,
    canAccessOpsPanel,
    canAccessClientDashboard,
    canAccessBrowseGigs
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
