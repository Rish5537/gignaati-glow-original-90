
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Landmark, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal";
  name: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
}

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
}

const PaymentMethodsList = ({ paymentMethods, setPaymentMethods }: PaymentMethodsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Payment Methods</CardTitle>
        <CardDescription>
          Manage your cards and bank accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map(method => (
            <div 
              key={method.id} 
              className={`p-4 border rounded-lg flex justify-between items-center ${method.isDefault ? 'border-blue-500 bg-blue-50' : ''}`}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded mr-3">
                  {method.type === 'card' && <CreditCard className="h-5 w-5 text-gray-700" />}
                  {method.type === 'bank' && <Landmark className="h-5 w-5 text-gray-700" />}
                  {method.type === 'paypal' && <DollarSign className="h-5 w-5 text-gray-700" />}
                </div>
                <div>
                  <div className="font-medium">{method.name}</div>
                  {method.expiry && (
                    <div className="text-sm text-gray-500">Expires {method.expiry}</div>
                  )}
                  {method.isDefault && (
                    <div className="text-xs text-blue-600 font-medium mt-1">Default Payment Method</div>
                  )}
                </div>
              </div>
              <div>
                {!method.isDefault ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setPaymentMethods(methods => 
                        methods.map(m => ({
                          ...m,
                          isDefault: m.id === method.id
                        }))
                      );
                      toast({
                        title: "Default updated",
                        description: `${method.name} is now your default payment method.`
                      });
                    }}
                  >
                    Set as Default
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate("/wallet-settings")}>
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={() => toast({ 
            title: "Coming soon", 
            description: "Add new payment method feature is coming soon." 
          })}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Payment Method
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodsList;
