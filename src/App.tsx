
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BrowseGigs from "./pages/BrowseGigs";
import GigDetail from "./pages/GigDetail";
import PostGig from "./pages/PostGig";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Academy from "./pages/Academy";
import AdminConsole from "./pages/AdminConsole";
import Auth from "./pages/Auth";
import Support from "./pages/Support";
import Messaging from "./pages/Messaging";
import Wallet from "./pages/Wallet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse-gigs" element={<BrowseGigs />} />
          <Route path="/gig/:id" element={<GigDetail />} />
          <Route path="/post-gig" element={<PostGig />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/support" element={<Support />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/wallet" element={<Wallet />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
