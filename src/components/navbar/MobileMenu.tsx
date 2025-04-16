
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole } from "@/services/types/rbac";

interface MobileMenuProps {
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

const MobileMenu = ({
  isAuthenticated,
  userName,
  userImage,
  userRoles = [],
  canAccessAdminPanel = false,
  canAccessOpsPanel = false,
  handleLogout,
  handleBuyAndTry,
  handleBecomeSeller,
}: MobileMenuProps) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden bg-white py-4 px-6 border-t">
      <div className="flex flex-col space-y-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          Home
        </Button>
        
        <Button variant="ghost" onClick={() => navigate('/browse-gigs')}>
          Browse Gigs
        </Button>
        
        <Button variant="ghost" onClick={() => navigate('/how-it-works')}>
          How It Works
        </Button>
        
        {isAuthenticated ? (
          <>
            <div className="flex items-center space-x-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userImage} />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{userName}</span>
            </div>
            
            <Button variant="ghost" onClick={() => navigate('/client-dashboard')}>
              Dashboard
            </Button>
            
            {canAccessAdminPanel && (
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                Admin Console
              </Button>
            )}
            
            {canAccessOpsPanel && (
              <Button variant="ghost" onClick={() => navigate('/ops')}>
                Ops Console
              </Button>
            )}
            
            <Button variant="ghost" onClick={() => navigate('/messaging')}>
              Messages
            </Button>
            
            <Button variant="ghost" onClick={() => navigate('/user-profile')}>
              Profile Settings
            </Button>
            
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Log in
            </Button>
            
            <Button onClick={handleBecomeSeller}>
              Become a Seller
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
