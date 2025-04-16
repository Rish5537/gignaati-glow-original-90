
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  onSubmit: () => Promise<void>;
  isProcessing: boolean;
}

const PaymentForm = ({ onSubmit, isProcessing }: PaymentFormProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onSubmit();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'There was a problem processing your payment',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">Credit/Debit Card</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
            </div>
          </RadioGroup>
          
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Doe" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiration">Expiration Date</Label>
                  <Input id="expiration" placeholder="MM/YY" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" type="password" />
                </div>
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
