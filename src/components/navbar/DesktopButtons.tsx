
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserMenuButton from './UserMenuButton';

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
      {/* Buy and Try / User Profile Button */}
      {isAuthenticated ? (
        <UserMenuButton 
          userName={userName} 
          userImage={userImage} 
          handleLogout={handleLogout} 
        />
      ) : (
        <Button 
          variant="outline" 
          className="border-gray-300"
          onClick={handleBuyAndTry}
        >
          Buy and Try
        </Button>
      )}
      
      {/* Become a Seller Button */}
      <Button 
        variant="default" 
        className="bg-gignaati-coral hover:bg-red-500 text-white rounded-md"
        onClick={handleBecomeSeller}
      >
        Become a Seller/Creator
      </Button>
    </div>
  );
};

export default DesktopButtons;
