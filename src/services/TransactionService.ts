
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export const createCheckoutSession = async (
  gigId: string,
  packageType: string,
  price: number
): Promise<{ url: string; orderId: string } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { gigId, packageType, price }
    });

    if (error || !data.success) {
      console.error('Error creating checkout session:', error || data.error);
      toast({
        title: "Checkout Error",
        description: data.error || "Failed to create checkout session",
        variant: "destructive"
      });
      return null;
    }

    return {
      url: data.url,
      orderId: data.orderId
    };
  } catch (error) {
    console.error('Error in checkout process:', error);
    toast({
      title: "Checkout Error",
      description: "An unexpected error occurred during checkout",
      variant: "destructive"
    });
    return null;
  }
};

export const verifyPayment = async (
  sessionId: string
): Promise<{ paymentStatus: TransactionStatus } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId }
    });

    if (error || !data.success) {
      console.error('Error verifying payment:', error || data.error);
      toast({
        title: "Payment Verification Error",
        description: data.error || "Failed to verify payment status",
        variant: "destructive"
      });
      return null;
    }

    return {
      paymentStatus: data.paymentStatus
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    toast({
      title: "Payment Verification Error",
      description: "An unexpected error occurred while verifying payment",
      variant: "destructive"
    });
    return null;
  }
};

export const getUserTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        orders (
          gig_id,
          package_type,
          status,
          gigs (
            title,
            image_url,
            profiles (full_name)
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in getUserTransactions:', error);
    return [];
  }
};
