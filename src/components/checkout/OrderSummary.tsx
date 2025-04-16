
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GigPackage } from '@/services/types/gigs';

interface OrderSummaryProps {
  selectedPackage: GigPackage | null;
  gigTitle?: string;
}

const OrderSummary = ({ selectedPackage, gigTitle }: OrderSummaryProps) => {
  if (!selectedPackage) return null;
  
  const subtotal = selectedPackage.price;
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + serviceFee;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <div className="font-medium mb-1">{gigTitle || 'Gig'}</div>
            <div className="text-muted-foreground mb-3">{selectedPackage.name} Package</div>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${(serviceFee / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t mt-2">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
