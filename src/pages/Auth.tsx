
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import MFASetup from "@/components/auth/MFASetup";
import AuthFooter from "@/components/auth/AuthFooter";
import { toast } from "@/hooks/use-toast";
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
  const { user, userProfile, canAccessAdminPanel, canAccessOpsPanel } = useAuth();
  
  // Get return URL from query params or localStorage
  const returnUrl = searchParams.get("returnUrl") || localStorage.getItem("authRedirectUrl") || "/";

  useEffect(() => {
    // Check if user is already logged in and profile is loaded
    if (user && userProfile) {
      console.log("User already logged in with profile, redirecting...", user, userProfile);
      
      // Only redirect if not in MFA step
      if (authStep !== AuthStep.MFA) {
        handleRoleBasedRedirection();
      }
    }
  }, [user, userProfile, authStep]);

  const handleRoleBasedRedirection = () => {
    // Clear the stored redirect URL to prevent future redirects
    const savedReturnUrl = localStorage.getItem("authRedirectUrl");
    localStorage.removeItem("authRedirectUrl");

    // First check if there's a specific return URL (like when admin adds a user)
    if (savedReturnUrl && savedReturnUrl.includes("/admin")) {
      console.log("Redirecting to admin with new user:", user?.id);
      navigate(`/admin?newUserId=${user?.id}`);
      return;
    }

    // Check if returnUrl is specified
    if (savedReturnUrl && savedReturnUrl !== "/") {
      navigate(savedReturnUrl);
      return;
    }

    // Otherwise redirect based on user role
    if (canAccessAdminPanel) {
      navigate("/admin");
    } else if (canAccessOpsPanel) {
      navigate("/ops");
    } else if (userProfile?.role === "creator") {
      navigate("/freelancer-dashboard");
    } else {
      // Default for buyers or users with no specific role
      navigate("/client-dashboard");
    }
  };

  const handleLoginSuccess = (data: { email: string, success: boolean, userId?: string }) => {
    if (data.success) {
      setEmail(data.email);
      setUserId(data.userId || "");
      
      // For normal flow - proceed to MFA or handle role-based redirect
      setAuthStep(AuthStep.MFA);
    }
  };

  const handleToggleForm = () => {
    setAuthStep(authStep === AuthStep.LOGIN ? AuthStep.SIGNUP : AuthStep.LOGIN);
  };

  const handleMFAComplete = () => {
    handleRoleBasedRedirection();
  };

  const handleMFACancel = () => {
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
