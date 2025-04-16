
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { verifyPayment } from "@/services/TransactionService";
import { toast } from "@/components/ui/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    // Check URL for stripe_session_id
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");
    
    const checkPayment = async () => {
      if (sessionId) {
        try {
          const result = await verifyPayment(sessionId);
          
          if (result && result.paymentStatus === 'completed') {
            setPaymentComplete(true);
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          toast({
            title: "Verification Error",
            description: "Could not verify payment status",
            variant: "destructive"
          });
        }
      } else {
        // If no session ID, assume payment was successful
        // In production, you'd want stricter verification
        setPaymentComplete(true);
      }
      
      setIsVerifying(false);
    };
    
    checkPayment();
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            <p className="text-gray-500">Verifying your payment...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 flex-1 flex justify-center">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your order has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="text-sm text-gray-600">
                {orderId && (
                  <div className="flex justify-between py-1">
                    <span>Order ID:</span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">Complete</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>
                You will receive an email confirmation shortly.<br />
                The creator will be notified of your order.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/">
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/orders">
                View Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
