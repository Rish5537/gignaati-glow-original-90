
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GigPackage } from '@/services/types/gigs';

// Import the custom RPC functions
import { 
  createOrdersTableIfNotExists, 
  createPackagesTableIfNotExists, 
  createTransactionsTableIfNotExists 
} from 'supabase/functions/rpc';

interface UseCheckoutReturn {
  isLoading: boolean;
  selectedPackage: GigPackage | null;
  gigTitle: string | undefined;
  isProcessingPayment: boolean;
  handlePaymentSubmit: () => Promise<void>;
}

export function useCheckout(): UseCheckoutReturn {
  const { toast } = useToast();
  const { gigId } = useParams();
  const [searchParams] = useSearchParams();
  const packageType = searchParams.get('package') || 'training';
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<GigPackage | null>(null);
  const [gigTitle, setGigTitle] = useState<string>();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  useEffect(() => {
    const setupTables = async () => {
      try {
        // Create necessary tables if they don't exist
        await createOrdersTableIfNotExists();
        await createPackagesTableIfNotExists();
        await createTransactionsTableIfNotExists();
        
        // Fetch gig data and package information if we have a gigId
        if (gigId) {
          const { data: gigData, error: gigError } = await supabase
            .from('gigs')
            .select('title, packages')
            .eq('id', gigId)
            .single();
            
          if (gigError) throw gigError;
          
          if (gigData) {
            setGigTitle(gigData.title);
            // Select the requested package from the gig's available packages
            if (gigData.packages && packageType in gigData.packages) {
              setSelectedPackage(gigData.packages[packageType] as GigPackage);
            }
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error setting up checkout:', error);
        toast({
          title: 'Error',
          description: 'Failed to load checkout information',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    setupTables();
  }, [gigId, packageType, toast]);
  
  const handlePaymentSubmit = async () => {
    try {
      setIsProcessingPayment(true);
      // Payment processing logic would go here
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Payment Successful',
        description: 'Your order has been processed successfully',
      });
      
      // In a real implementation, you would:
      // 1. Process payment through Stripe or another provider
      // 2. Create order record in the database
      // 3. Redirect to order confirmation page
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  return {
    isLoading,
    selectedPackage,
    gigTitle,
    isProcessingPayment,
    handlePaymentSubmit
  };
}
