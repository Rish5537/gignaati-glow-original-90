
import { useCheckout } from '@/hooks/useCheckout';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import BillingForm from '@/components/checkout/BillingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import CheckoutLoader from '@/components/checkout/CheckoutLoader';

const Checkout = () => {
  const {
    isLoading,
    selectedPackage,
    gigTitle,
    isProcessingPayment,
    handlePaymentSubmit
  } = useCheckout();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <CheckoutLoader />
      ) : (
        <>
          <CheckoutHeader />
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <BillingForm />
              <PaymentForm 
                onSubmit={handlePaymentSubmit} 
                isProcessing={isProcessingPayment} 
              />
            </div>
            <div className="h-fit">
              <OrderSummary selectedPackage={selectedPackage} gigTitle={gigTitle} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
