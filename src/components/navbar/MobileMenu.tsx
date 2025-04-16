
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavLinks from './NavLinks';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileMenuProps {
  isAuthenticated: boolean;
  userName: string;
  userImage: string;
  handleLogout: () => void;
  handleBuyAndTry: () => void;
  handleBecomeSeller: () => void;
}

const MobileMenu = ({ 
  isAuthenticated, 
  userName, 
  userImage, 
  handleLogout, 
  handleBuyAndTry,
  handleBecomeSeller
}: MobileMenuProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="md:hidden bg-white absolute top-16 left-0 w-full px-6 py-4 shadow-md z-50">
      <div className="flex flex-col space-y-4">
        <NavLinks mobile />
        <div className="flex flex-col space-y-2 pt-4 border-t">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 p-2 border rounded-md">
                {userImage ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ) : (
                  <User size={16} />
                )}
                <span>{userName}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/user-profile')}
              >
                <User size={16} className="mr-2" />
                See Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleBuyAndTry}
            >
              Buy and Try
            </Button>
          )}
          
          <Button 
            variant="default" 
            className="bg-gignaati-coral hover:bg-red-500 text-white w-full"
            onClick={handleBecomeSeller}
          >
            Become a Seller/Creator
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
