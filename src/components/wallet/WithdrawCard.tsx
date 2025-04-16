
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal";
  name: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
}

interface WithdrawCardProps {
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (id: string) => void;
  paymentMethods: PaymentMethod[];
  isWithdrawing: boolean;
  handleWithdraw: () => void;
}

const WithdrawCard = ({ 
  withdrawAmount, 
  setWithdrawAmount, 
  selectedPaymentMethod, 
  setSelectedPaymentMethod, 
  paymentMethods,
  isWithdrawing,
  handleWithdraw
}: WithdrawCardProps) => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>
          Transfer money to your bank account or payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="amount"
                  placeholder="0.00"
                  className="pl-9"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} {method.isDefault && " (Default)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-gray-500">
                <HelpCircle className="h-4 w-4 mr-1" />
                Processing time: 1-3 business days
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Withdrawal requests are typically processed within 1-3 business days depending on your bank and location.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={handleWithdraw} disabled={isWithdrawing}>
          {isWithdrawing ? "Processing..." : "Withdraw Funds"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WithdrawCard;
