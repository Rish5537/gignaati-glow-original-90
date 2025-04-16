
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, ShoppingCart } from "lucide-react";
import { createCheckoutSession } from "@/services/TransactionService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Checkout = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const packageType = searchParams.get("package") || "training";
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [gigDetails, setGigDetails] = useState<any>(null);
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
  }, []);

  // Fetch gig and package details
  useEffect(() => {
    const fetchGigAndPackage = async () => {
      if (!id) return;
      
      try {
        const { data: gigData, error: gigError } = await supabase
          .from('gigs')
          .select('*, profiles(full_name)')
          .eq('id', id)
          .single();
        
        if (gigError || !gigData) {
          console.error('Error fetching gig:', gigError);
          toast({
            title: "Gig Not Found",
            description: "The requested gig could not be found.",
            variant: "destructive"
          });
          return;
        }
        
        setGigDetails(gigData);
        
        const { data: packageData, error: packageError } = await supabase
          .from('gig_packages')
          .select('*')
          .eq('gig_id', id)
          .eq('package_type', packageType)
          .single();
        
        if (packageError) {
          console.error('Error fetching package:', packageError);
          
          // If no package found in database, use mock data
          setPackageDetails({
            title: packageType.charAt(0).toUpperCase() + packageType.slice(1),
            description: `${packageType} package for ${gigData.title}`,
            price: packageType === 'setup' ? 199 : packageType === 'training' ? 349 : 599,
            delivery_time: packageType === 'setup' ? '3 days' : packageType === 'training' ? '5 days' : '7 days',
            revisions: packageType === 'setup' ? 1 : packageType === 'training' ? 3 : 'Unlimited'
          });
        } else {
          setPackageDetails(packageData);
        }
      } catch (error) {
        console.error('Error in fetchGigAndPackage:', error);
        toast({
          title: "Error",
          description: "Failed to load checkout details",
          variant: "destructive"
        });
      }
    };
    
    fetchGigAndPackage();
  }, [id, packageType]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Save return URL and redirect to auth
      localStorage.setItem('authRedirectUrl', window.location.pathname + window.location.search);
      navigate('/auth');
      return;
    }
    
    if (!id || !packageDetails) return;
    
    setIsLoading(true);
    
    try {
      const result = await createCheckoutSession(id, packageType, packageDetails.price);
      
      if (result?.url) {
        window.location.href = result.url;
      } else {
        toast({
          title: "Checkout Error",
          description: "Could not create checkout session",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout Failed",
        description: "An unexpected error occurred during checkout",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth and fetching data
  if (isAuthenticated === null || !gigDetails || !packageDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            <p className="text-gray-500">Loading checkout details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 flex-1">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  You are purchasing the {packageDetails.title} package for {gigDetails.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-start">
                  {gigDetails.image_url ? (
                    <img 
                      src={gigDetails.image_url} 
                      alt={gigDetails.title}
                      className="w-24 h-24 object-cover rounded-md" 
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                      <ShoppingCart className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{gigDetails.title}</h3>
                    <p className="text-gray-600">By: {gigDetails.profiles?.full_name || "Freelancer"}</p>
                    <div className="mt-2 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {packageDetails.title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Package Details</h4>
                  <p className="text-gray-700 mb-3">{packageDetails.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Delivery Time</span>
                      <p className="font-medium">{packageDetails.delivery_time}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Revisions</span>
                      <p className="font-medium">{packageDetails.revisions}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Summary Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${packageDetails.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${packageDetails.price.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  className="w-full bg-gignaati-coral hover:bg-red-500"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Your payment will be processed securely by Stripe.</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
