
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

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
  handleBecomeSeller,
}: DesktopButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex space-x-4 items-center">
      {isAuthenticated ? (
        <>
          <Button 
            onClick={handleBecomeSeller} 
            variant="outline" 
            className="font-medium"
          >
            Become a Seller
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-0 h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  {userImage && <AvatarImage src={userImage} alt={userName} />}
                  <AvatarFallback className="bg-gray-100 text-primary">
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/client-dashboard')}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/messaging')}>
                Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/wallet')}>
                Wallet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/user-profile')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin')}>
                Admin Console
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button 
            onClick={handleBecomeSeller}
            variant="outline" 
            className="font-medium"
          >
            Become a Seller
          </Button>
          <Button 
            onClick={handleBuyAndTry}
            className="bg-black hover:bg-gray-800"
          >
            Log In
          </Button>
        </>
      )}
    </div>
  );
};

export default DesktopButtons;
