import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Index from "@/pages/Index";
import BrowseGigs from "@/pages/BrowseGigs";
import AIGigs from "@/pages/AIGigs";
import GigDetail from "@/pages/GigDetail";
import Auth from "@/pages/Auth";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import HowItWorks from "@/pages/HowItWorks";
import PostGig from "@/pages/PostGig";
import CustomAgentRequest from "@/pages/CustomAgentRequest";
import BecomeASeller from "@/pages/BecomeASeller";
import UserProfile from "@/pages/UserProfile";
import ClientDashboard from "@/pages/ClientDashboard";
import FreelancerDashboard from "@/pages/FreelancerDashboard";
import Messaging from "@/pages/Messaging";
import Wallet from "@/pages/Wallet";
import Support from "@/pages/Support";
import Waitlist from "@/pages/Waitlist";
import OpsConsole from "@/pages/OpsConsole";
import AdminConsole from "@/pages/AdminConsole";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster"

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/browse" element={<BrowseGigs />} />
        <Route path="/ai-gigs" element={<AIGigs />} />
        <Route path="/gig/:id" element={<GigDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/post-gig" element={<PostGig />} />
        <Route path="/custom-agent" element={<CustomAgentRequest />} />
        <Route path="/become-a-seller" element={<BecomeASeller />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/support" element={<Support />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/ops-console" element={<OpsConsole />} />
        <Route path="/admin-console" element={<AdminConsole />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
