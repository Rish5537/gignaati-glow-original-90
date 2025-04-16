
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Page imports
import Index from './pages/Index';
import Auth from './pages/Auth';
import BrowseGigs from './pages/BrowseGigs';
import AIGigs from './pages/AIGigs';
import HowItWorks from './pages/HowItWorks';
import GigDetail from './pages/GigDetail';
import Waitlist from './pages/Waitlist';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Support from './pages/Support';
import Messaging from './pages/Messaging';
import PostGig from './pages/PostGig';
import BecomeASeller from './pages/BecomeASeller';
import CustomAgentRequest from './pages/CustomAgentRequest';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import UserProfile from './pages/UserProfile';
import Wallet from './pages/Wallet';
import OpsConsole from './pages/OpsConsole';
import AdminConsole from './pages/AdminConsole';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// New page imports for category management and disputes system
import CategoryLocation from './pages/CategoryLocation';
import DisputesTrust from './pages/DisputesTrust';

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/browse" element={<BrowseGigs />} />
          <Route path="/ai-gigs" element={<AIGigs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/gig/:id" element={<GigDetail />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/support" element={<Support />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/post-gig" element={<PostGig />} />
          <Route path="/become-a-seller" element={<BecomeASeller />} />
          <Route path="/request-custom-agent" element={<CustomAgentRequest />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/ops-console" element={<OpsConsole />} />
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* New routes for Category/Location and Disputes/Trust */}
          <Route path="/category-location" element={<CategoryLocation />} />
          <Route path="/disputes-trust" element={<DisputesTrust />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
};

export default App;
