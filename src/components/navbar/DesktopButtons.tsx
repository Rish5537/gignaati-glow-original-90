
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { UserRole } from "@/services/types/rbac";

interface DesktopButtonsProps {
  isAuthenticated: boolean;
  userName: string;
  userImage?: string;
  userRoles?: UserRole[];
  canAccessAdminPanel?: boolean;
  canAccessOpsPanel?: boolean;
  handleLogout: () => void;
  handleBuyAndTry: () => void;
  handleBecomeSeller: () => void;
}

const DesktopButtons = ({
  isAuthenticated,
  userName,
  userImage,
  userRoles = [],
  canAccessAdminPanel = false,
  canAccessOpsPanel = false,
  handleLogout,
  handleBuyAndTry,
  handleBecomeSeller,
}: DesktopButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      {isAuthenticated ? (
        <div className="flex items-center space-x-4">
          <Button
            variant="default"
            onClick={handleBuyAndTry}
          >
            Browse Gigs
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userImage} />
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline">{userName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/client-dashboard')}>
                Dashboard
              </DropdownMenuItem>
              
              {canAccessAdminPanel && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  Admin Console
                </DropdownMenuItem>
              )}
              
              {canAccessOpsPanel && (
                <DropdownMenuItem onClick={() => navigate('/ops')}>
                  Ops Console
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={() => navigate('/messaging')}>
                Messages
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/user-profile')}>
                Profile Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <>
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
          >
            Log in
          </Button>
          <Button onClick={handleBecomeSeller}>Become a Seller</Button>
        </>
      )}
    </div>
  );
};

export default DesktopButtons;
