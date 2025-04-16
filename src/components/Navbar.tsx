
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './navbar/Logo';
import NavLinks from './navbar/NavLinks';
import DesktopButtons from './navbar/DesktopButtons';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const navigate = useNavigate();

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        // Get user data from localStorage if authenticated
        const storedUserName = localStorage.getItem('userName') || 'User';
        const storedUserImage = localStorage.getItem('userImage') || '';
        setUserName(storedUserName);
        setUserImage(storedUserImage);
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage events (in case another tab changes auth status)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBecomeSeller = () => {
    navigate('/become-a-seller');
  };

  const handleBuyAndTry = () => {
    // If not authenticated, redirect to auth page and set return URL
    if (!isAuthenticated) {
      localStorage.setItem('authRedirectUrl', '/');
      navigate('/auth');
    }
  };

  const handleLogout = () => {
    // Clear authentication status and user data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userImage');
    setIsAuthenticated(false);
    setUserName('');
    setUserImage('');
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
          handleLogout={handleLogout}
          handleBuyAndTry={handleBuyAndTry}
          handleBecomeSeller={handleBecomeSeller}
        />
      )}
    </nav>
  );
};

export default Navbar;
