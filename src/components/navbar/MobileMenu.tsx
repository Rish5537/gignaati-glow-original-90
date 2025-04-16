
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavLinks from './NavLinks';

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
  return (
    <div className="md:hidden py-4 px-4 space-y-4 bg-white border-t">
      <NavLinks />
      
      <div className="space-y-2">
        {isAuthenticated ? (
          <>
            <div className="flex items-center space-x-2 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-800">{userName}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Link to="/client-dashboard" className="w-full">
                <Button variant="outline" className="w-full">Dashboard</Button>
              </Link>
              <Link to="/messaging" className="w-full">
                <Button variant="outline" className="w-full">Messages</Button>
              </Link>
              <Link to="/wallet" className="w-full">
                <Button variant="outline" className="w-full">Wallet</Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleBecomeSeller}
                className="w-full"
              >
                Become a Seller
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full"
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              onClick={handleBecomeSeller}
              className="w-full"
            >
              Become a Seller
            </Button>
            <Button
              variant="default"
              onClick={handleBuyAndTry}
              className="w-full"
            >
              Buy & Try
            </Button>
            <Link to="/auth" className="w-full">
              <Button variant="secondary" className="w-full">Log In</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
