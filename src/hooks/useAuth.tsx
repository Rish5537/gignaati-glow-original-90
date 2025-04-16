import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/services/types/rbac";
import { getCurrentUserRoles } from "@/services/RBACService";

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
  getRedirectPathForUser: () => string;
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
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load roles after a short delay to prevent recursion with Supabase client
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
      const roles = await getCurrentUserRoles();
      setUserRoles(roles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      setUserRoles([]);
    }
  };

  const hasRole = (role: UserRole) => {
    return userRoles.includes(role);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
  const getRedirectPathForUser = () => {
    // Check for specific return URL first
    const storedReturnUrl = localStorage.getItem("authRedirectUrl");
    if (storedReturnUrl) {
      localStorage.removeItem("authRedirectUrl");
      return storedReturnUrl;
    }
    
    // Otherwise redirect based on user role
    if (hasRole('admin')) {
      return "/admin";
    } else if (hasRole('creator')) {
      return "/freelancer-dashboard";
    } else if (hasRole('ops_team')) {
      return "/ops";
    } else {
      // Default for buyers or users with no specific role
      return "/client-dashboard";
    }
  };

  const value: AuthContextValue = {
    user,
    session,
    userRoles,
    isLoading,
    isAdmin: hasRole('admin'),
    isOpsTeam: hasRole('ops_team'),
    isCreator: hasRole('creator'),
    isBuyer: hasRole('buyer'),
    isModerator: hasRole('moderator'),
    hasRole,
    signOut,
    getRedirectPathForUser
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
