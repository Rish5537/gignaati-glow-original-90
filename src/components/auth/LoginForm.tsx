
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

interface LoginFormProps {
  onSuccess?: (data: { email: string, success: boolean }) => void;
  onToggleForm?: () => void;
}

const LoginForm = ({ onSuccess, onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess({ email, success: true });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An error occurred during login",
      });
      
      // Call onSuccess with failure
      if (onSuccess) {
        onSuccess({ email, success: false });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link 
              to="/forgot-password" 
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <label 
            htmlFor="remember" 
            className="text-sm text-gray-500 cursor-pointer"
          >
            Remember me
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="mt-6">
          <SocialLoginButtons />
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <button 
              type="button"
              className="text-blue-600 hover:underline"
              onClick={onToggleForm}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
