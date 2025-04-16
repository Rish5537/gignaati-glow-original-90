
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import HowItWorks from './components/HowItWorks';
import TrustIndicators from './components/TrustIndicators';
import FeaturedGigs from './components/FeaturedGigs';
import FinalCTA from './components/FinalCTA';
import GigGrid from './components/GigGrid';

// Pages 
import CategoryLocation from './pages/CategoryLocation';
import DisputesTrust from './pages/DisputesTrust';

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <CategoryGrid />
                <HowItWorks />
                <TrustIndicators />
                <FeaturedGigs />
                <FinalCTA />
              </>
            }
          />
          <Route
            path="/explore"
            element={
              <GigGrid 
                searchQuery="" 
                sortBy="newest" 
                filters={{
                  categories: [],
                  priceRange: [0, 1000],
                  ratings: [],
                  functions: [],
                  types: [],
                  llmModels: [],
                  hostingProviders: [],
                  industries: [],
                  integrations: [],
                  businessFunctions: [],
                  professions: []
                }} 
              />
            }
          />
          <Route
            path="/admin/categories-locations"
            element={<CategoryLocation />}
          />
          <Route
            path="/admin/disputes-trust"
            element={<DisputesTrust />}
          />
        </Routes>
        <ScrollToTop />
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
};

export default App;
