import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const setupDatabase = async () => {
  try {
    const { error: ordersTableError } = await supabase.rpc('create_orders_table_if_not_exists');
    if (ordersTableError) console.error("Error creating orders table:", ordersTableError);
    
    const { error: packagesTableError } = await supabase.rpc('create_packages_table_if_not_exists');
    if (packagesTableError) console.error("Error creating packages table:", packagesTableError);
    
    const { error: transactionsTableError } = await supabase.rpc('create_transactions_table_if_not_exists');
    if (transactionsTableError) console.error("Error creating transactions table:", transactionsTableError);
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};

const Checkout = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const packageType = searchParams.get("package");
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [gigData, setGigData] = useState<any>(null);
  const [packageData, setPackageData] = useState<any>(null);
  
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem("authRedirectUrl", window.location.pathname + window.location.search);
      navigate("/auth");
      return;
    }
    
    setupDatabase();
    
    const fetchGigData = async () => {
      if (!id) return;
      setLoading(true);
      
      try {
        const { data: gig, error: gigError } = await supabase
          .from('gigs')
          .select(`
            id, 
            title, 
            price,
            freelancer_id,
            profiles (
              id,
              full_name
            )
          `)
          .eq('id', id)
          .single();
        
        if (gigError) throw gigError;
        
        if (packageType) {
          const { data: packageInfo, error: packageError } = await supabase
            .from('gig_packages')
            .select('*')
            .eq('gig_id', id)
            .eq('package_type', packageType)
            .single();
          
          if (packageError && packageError.code !== 'PGRST116') {
            throw packageError;
          }
          
          setPackageData(packageInfo);
        }
        
        setGigData(gig);
      } catch (error) {
        console.error("Error fetching gig data:", error);
        toast({
          title: "Error fetching data",
          description: "Could not load gig information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGigData();
  }, [id, packageType, user, navigate]);
  
  const handleSubmitOrder = async () => {
    if (!user || !gigData) return;
    
    setLoading(true);
    
    try {
      const { data: tableExists } = await supabase.rpc('table_exists', { table_name: 'orders' });
      
      if (!tableExists) {
        await setupDatabase();
      }
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          gig_id: gigData.id,
          client_id: user.id,
          freelancer_id: gigData.freelancer_id,
          package_type: packageType || 'standard',
          price: packageData ? packageData.price : gigData.price,
          requirements: requirements,
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) {
        console.error("Order error:", orderError);
        throw orderError;
      }
      
      const { data: transTableExists } = await supabase.rpc('table_exists', { table_name: 'transactions' });
      
      if (transTableExists) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            order_id: order.id,
            user_id: user.id,
            amount: packageData ? packageData.price : gigData.price,
            payment_status: 'pending',
            payment_method: 'credit_card'
          });
        
        if (transactionError) {
          console.error("Transaction error:", transactionError);
        }
      }
      
      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed. You will be redirected to payment.",
      });
      
      setTimeout(() => navigate(`/client-dashboard`), 2000);
      
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Error placing order",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !gigData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gignaati-coral" />
            <p className="mt-4 text-gray-600">Loading checkout information...</p>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
                <CardDescription>
                  You are purchasing the {packageType || "standard"} package for {gigData?.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Project Requirements</h3>
                    <Textarea 
                      placeholder="Describe your specific requirements for this project..."
                      className="min-h-[120px]"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  className="bg-gignaati-coral hover:bg-red-500"
                  onClick={handleSubmitOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{gigData?.title}</h4>
                    <p className="text-sm text-gray-500">
                      By {gigData?.profiles?.full_name || "Freelancer"}
                    </p>
                  </div>
                  
                  {packageData && (
                    <div>
                      <h4 className="font-medium">{packageData.title}</h4>
                      <p className="text-sm text-gray-500">
                        {packageData.description}
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Package Price</span>
                    <span className="font-semibold">${packageData?.price || gigData?.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Service Fee</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${packageData?.price || gigData?.price}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    By placing an order, you agree to the terms and conditions of Gignaati.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
