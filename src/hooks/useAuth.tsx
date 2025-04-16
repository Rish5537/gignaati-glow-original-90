import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/services/types/rbac";
import { toast } from "@/hooks/use-toast";

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
  userProfile: any | null;
  createUser?: (email: string, password: string, role: UserRole, fullName?: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserRoles([]);
          setUserProfile(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }
      
      setUserProfile(profile);
      
      if (profile && profile.role) {
        setUserRoles([profile.role]);
      } else {
        setUserRoles([]);
      }
      
      const { data: additionalRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
        
      if (rolesError) {
        console.error("Error fetching additional roles:", rolesError);
        return;
      }
      
      if (additionalRoles && additionalRoles.length > 0) {
        const existingRoles = new Set(userRoles);
        additionalRoles.forEach(roleObj => existingRoles.add(roleObj.role));
        setUserRoles(Array.from(existingRoles));
      }
      
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      setUserRoles([]);
      setUserProfile(null);
    }
  };

  const createUser = async (email: string, password: string, role: UserRole, fullName?: string): Promise<User | null> => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can create new users",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email,
          password,
          role,
          full_name: fullName
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "New user created successfully"
      });
      
      return data.user;
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: `Failed to create user: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const hasRole = (role: UserRole) => {
    return userRoles.includes(role);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRoles([]);
    setUserProfile(null);
  };

  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator');
  const isOpsTeam = hasRole('ops_team');
  const isCreator = hasRole('creator');
  const isBuyer = hasRole('buyer');
  
  const canAccessAdminPanel = isAdmin || isModerator;
  const canAccessOpsPanel = isOpsTeam || isAdmin;
  const canAccessClientDashboard = true;
  const canAccessBrowseGigs = true;

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
    canAccessBrowseGigs,
    userProfile,
    createUser
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
