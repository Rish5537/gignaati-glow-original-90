
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import Logo from './navbar/Logo';
import NavLinks from './navbar/NavLinks';
import DesktopButtons from './navbar/DesktopButtons';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, userRoles, canAccessAdminPanel, canAccessOpsPanel } = useAuth();
  
  // Derived state from auth context
  const isAuthenticated = !!user;
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userImage = user?.user_metadata?.avatar_url || '';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBecomeSeller = () => {
    navigate('/become-a-seller');
  };

  const handleBuyAndTry = () => {
    if (!isAuthenticated) {
      localStorage.setItem('authRedirectUrl', '/browse-gigs');
      navigate('/auth');
      return;
    }
    
    navigate('/browse-gigs');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <nav className="bg-white py-4 px-6 shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </div>

        {/* Authentication and Seller Buttons */}
        <DesktopButtons
          isAuthenticated={isAuthenticated}
          userName={userName}
          userImage={userImage}
          userRoles={userRoles}
          canAccessAdminPanel={canAccessAdminPanel}
          canAccessOpsPanel={canAccessOpsPanel}
          handleLogout={handleLogout}
          handleBuyAndTry={handleBuyAndTry}
          handleBecomeSeller={handleBecomeSeller}
        />

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <MobileMenu
          isAuthenticated={isAuthenticated}
          userName={userName}
          userImage={userImage}
          userRoles={userRoles}
          canAccessAdminPanel={canAccessAdminPanel}
          canAccessOpsPanel={canAccessOpsPanel}
          handleLogout={handleLogout}
          handleBuyAndTry={handleBuyAndTry}
          handleBecomeSeller={handleBecomeSeller}
        />
      )}
    </nav>
  );
};

export default Navbar;
