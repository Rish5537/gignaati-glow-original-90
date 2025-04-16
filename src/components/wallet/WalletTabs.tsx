
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionTable, { Transaction } from "./TransactionTable";
import PaymentMethodsList, { PaymentMethod } from "./PaymentMethodsList";

interface WalletTabsProps {
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

const WalletTabs = ({ 
  transactions, 
  paymentMethods, 
  setPaymentMethods,
  formatCurrency,
  formatDate 
}: WalletTabsProps) => {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
        <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
      </TabsList>
      
      <TabsContent value="transactions" className="pt-4">
        <TransactionTable 
          transactions={transactions} 
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="payment-methods" className="pt-4">
        <PaymentMethodsList 
          paymentMethods={paymentMethods} 
          setPaymentMethods={setPaymentMethods} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default WalletTabs;
