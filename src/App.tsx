
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BrowseGigs from "./pages/BrowseGigs";
import GigDetail from "./pages/GigDetail";
import PostGig from "./pages/PostGig";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import AdminConsole from "./pages/AdminConsole";
import OpsConsole from "./pages/OpsConsole";
import Auth from "./pages/Auth";
import Support from "./pages/Support";
import Messaging from "./pages/Messaging";
import Wallet from "./pages/Wallet";
import AIGigs from "./pages/AIGigs";
import HowItWorks from "./pages/HowItWorks";
import BecomeASeller from "./pages/BecomeASeller";
import ScrollToTop from "./components/ScrollToTop";
import Checkout from "./pages/Checkout";
import CustomAgentRequest from "./pages/CustomAgentRequest";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse-gigs" element={<BrowseGigs />} />
            <Route path="/ai-gigs" element={<AIGigs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/gig/:id" element={<GigDetail />} />
            <Route path="/post-gig" element={<PostGig />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
            <Route path="/admin" element={<AdminConsole />} />
            <Route path="/ops" element={<OpsConsole />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/support" element={<Support />} />
            <Route path="/messaging" element={<Messaging />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/become-a-seller" element={<BecomeASeller />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/custom-agent-request/:id" element={<CustomAgentRequest />} />
            <Route path="/user-profile" element={<UserProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
