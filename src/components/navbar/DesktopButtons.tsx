
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface DesktopButtonsProps {
  isAuthenticated: boolean;
  userName: string;
  userImage: string;
  handleLogout: () => void;
  handleBuyAndTry: () => void;
  handleBecomeSeller: () => void;
}

const DesktopButtons = ({
  isAuthenticated,
  userName,
  userImage,
  handleLogout,
  handleBuyAndTry,
  handleBecomeSeller
}: DesktopButtonsProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <Button 
            variant="outline" 
            onClick={handleBecomeSeller}
          >
            Become a Seller
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="cursor-pointer h-8 w-8">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/client-dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <Link to="/messaging">
                <DropdownMenuItem className="cursor-pointer">
                  Messages
                </DropdownMenuItem>
              </Link>
              <Link to="/wallet">
                <DropdownMenuItem className="cursor-pointer">
                  Wallet
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            onClick={handleBecomeSeller}
          >
            Become a Seller
          </Button>
          
          <Button
            variant="default"
            onClick={handleBuyAndTry}
          >
            Buy & Try
          </Button>
          
          <Link to="/auth">
            <Button variant="secondary">Log In</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopButtons;
