
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import { useNavigate } from "react-router-dom";

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
  handleBecomeSeller,
}: MobileMenuProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="md:hidden bg-white p-4 border-t flex flex-col space-y-4">
      <NavLinks />

      {isAuthenticated ? (
        <>
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
            <Avatar className="h-9 w-9">
              {userImage && <AvatarImage src={userImage} alt={userName} />}
              <AvatarFallback className="bg-gray-100 text-primary">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-xs text-gray-500">Logged in</div>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={() => navigate('/client-dashboard')}
          >
            My Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={() => navigate('/messaging')}
          >
            Messages
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={() => navigate('/admin')}
          >
            Admin Console
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={handleBecomeSeller}
          >
            Become a Seller
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full justify-center"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={handleBecomeSeller}
          >
            Become a Seller
          </Button>
          
          <Button 
            className="w-full justify-center bg-black hover:bg-gray-800"
            onClick={handleBuyAndTry}
          >
            Log In
          </Button>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
