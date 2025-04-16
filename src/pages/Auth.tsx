
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import MFASetup from "@/components/auth/MFASetup";
import AuthFooter from "@/components/auth/AuthFooter";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

enum AuthStep {
  LOGIN = "login",
  SIGNUP = "signup",
  MFA = "mfa",
}

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get("tab") === "signup" ? AuthStep.SIGNUP : AuthStep.LOGIN;
  
  const [authStep, setAuthStep] = useState<AuthStep>(initialTab);
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const { userRoles } = useAuth();
  
  // Get return URL from query params or localStorage
  const returnUrl = searchParams.get("returnUrl") || localStorage.getItem("authRedirectUrl") || "/";

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect based on role
        handleRoleBasedRedirection();
      }
    };
    
    checkAuth();
  }, [userRoles]);

  const handleRoleBasedRedirection = () => {
    // First check if there's a specific return URL (like when admin adds a user)
    if (returnUrl && returnUrl !== "/") {
      console.log("Redirecting to return URL:", returnUrl);
      localStorage.removeItem("authRedirectUrl");
      navigate(returnUrl);
      return;
    }

    // Otherwise redirect based on user role
    if (userRoles.includes("admin")) {
      navigate("/admin");
    } else if (userRoles.includes("creator")) {
      navigate("/freelancer-dashboard");
    } else if (userRoles.includes("ops_team")) {
      navigate("/ops");
    } else {
      // Default for buyers or users with no specific role
      navigate("/client-dashboard");
    }
  };

  const handleLoginSuccess = (data: { email: string, success: boolean, userId?: string }) => {
    if (data.success) {
      setEmail(data.email);
      setUserId(data.userId || data.email);
      localStorage.setItem("isAuthenticated", "true");
      
      // Set default user name if not already set
      if (!localStorage.getItem("userName")) {
        const username = data.email.split("@")[0];
        localStorage.setItem("userName", username);
        localStorage.setItem("userEmail", data.email);
      }
      
      // Always check if this is an admin-initiated "Add User" flow
      const adminAddUserFlow = returnUrl && returnUrl.includes("/admin");
      
      // For admin add user flow, skip MFA and redirect immediately
      if (adminAddUserFlow) {
        toast({
          title: "User created successfully!",
          description: "Redirecting back to admin console..."
        });
        
        // Short delay to ensure data is saved
        setTimeout(() => {
          localStorage.removeItem("authRedirectUrl");
          // Include the new user ID in the URL for the admin console to use
          navigate(`/admin?newUserId=${data.userId}`);
        }, 1000);
      } else if (returnUrl && returnUrl !== "/") {
        // For other return URLs
        toast({
          title: "Login successful!",
          description: "Redirecting you to complete your action..."
        });
        localStorage.removeItem("authRedirectUrl");
        navigate(returnUrl);
      } else {
        // Normal flow - check roles or proceed to MFA
        if (userRoles.length > 0) {
          handleRoleBasedRedirection();
        } else {
          setAuthStep(AuthStep.MFA);
        }
      }
    }
  };

  const handleToggleForm = () => {
    setAuthStep(authStep === AuthStep.LOGIN ? AuthStep.SIGNUP : AuthStep.LOGIN);
  };

  const handleMFAComplete = () => {
    localStorage.setItem("isAuthenticated", "true");
    handleRoleBasedRedirection();
  };

  const handleMFACancel = () => {
    // Even on cancel, we'll consider the user authenticated for demo purposes
    localStorage.setItem("isAuthenticated", "true");
    handleRoleBasedRedirection();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#14213D] to-[#1e3a6a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <AuthHeader 
            title="Welcome to Gignaati.com" 
            description={returnUrl !== "/" ? 
              "Please log in to continue with your action" : 
              "Connect with the world's best AI talent"} 
          />
        </div>
        
        <div className="px-6 py-8">
          {authStep === AuthStep.LOGIN && (
            <LoginForm 
              onSuccess={handleLoginSuccess}
              onToggleForm={handleToggleForm}
            />
          )}
          
          {authStep === AuthStep.SIGNUP && (
            <SignupForm 
              onToggleForm={handleToggleForm}
            />
          )}
          
          {authStep === AuthStep.MFA && (
            <MFASetup 
              userId={userId}
              onComplete={handleMFAComplete}
              onCancel={handleMFACancel}
            />
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4">
          <AuthFooter />
        </div>
      </div>
    </div>
  );
};

export default Auth;
