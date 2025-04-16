
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SocialLoginButtons from "./SocialLoginButtons";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SignupFormProps {
  onToggleForm: () => void;
}

const SignupForm = ({ onToggleForm }: SignupFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Store user info
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", fullName || email.split("@")[0]);
      localStorage.setItem("userEmail", email);
      
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      
      // Check if this was initiated from admin "Add User"
      const authRedirectUrl = localStorage.getItem("authRedirectUrl");
      
      if (authRedirectUrl && authRedirectUrl.includes("/admin")) {
        console.log("Admin add user flow detected, userId:", data.user?.id);
        // Add the new user ID as a URL parameter so admin page can open role dialog
        navigate(`/admin?newUserId=${data.user?.id}`);
        localStorage.removeItem("authRedirectUrl");
      } else {
        // Normal flow - redirect to MFA setup or main page
        localStorage.setItem("newUserId", data.user?.id || "");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <p className="text-xs text-gray-500">Must be at least 6 characters</p>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
              Creating Account...
            </div>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
      
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or continue with</span>
          </div>
        </div>
        
        <SocialLoginButtons />
      </div>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button 
            type="button" 
            onClick={onToggleForm}
            className="text-primary font-medium hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
