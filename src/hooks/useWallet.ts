
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Transaction } from "@/components/wallet/TransactionTable";
import { PaymentMethod } from "@/components/wallet/PaymentMethodsList";

export default function useWallet() {
  const [balance, setBalance] = useState(2458.75);
  const [pendingBalance, setPendingBalance] = useState(350.00);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-001",
      date: new Date(2024, 3, 10),
      description: "AI Automation Gig Payment",
      amount: 450.00,
      type: "income",
      status: "completed"
    },
    {
      id: "tx-002",
      date: new Date(2024, 3, 8),
      description: "GPT Prompt Writing Service",
      amount: 250.00,
      type: "income",
      status: "completed"
    },
    {
      id: "tx-003",
      date: new Date(2024, 3, 5),
      description: "Withdrawal to Bank Account",
      amount: 600.00,
      type: "withdrawal",
      status: "completed"
    },
    {
      id: "tx-004",
      date: new Date(2024, 3, 1),
      description: "Market Research AI Agent",
      amount: 350.00,
      type: "income",
      status: "pending"
    },
    {
      id: "tx-005",
      date: new Date(2024, 2, 28),
      description: "Content Generator Subscription",
      amount: 89.99,
      type: "expense",
      status: "completed"
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-001",
      type: "card",
      name: "Visa ending in 4242",
      last4: "4242",
      expiry: "04/25",
      isDefault: true
    },
    {
      id: "pm-002",
      type: "bank",
      name: "Chase Banking",
      last4: "9876",
      isDefault: false
    },
    {
      id: "pm-003",
      type: "paypal",
      name: "PayPal Account",
      isDefault: false
    }
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0].id);
  
  const { toast } = useToast();

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount."
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "Your withdrawal amount exceeds your available balance."
      });
      return;
    }
    
    setIsWithdrawing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: `tx-${Math.random().toString(36).substring(2, 9)}`,
        date: new Date(),
        description: "Withdrawal to Bank Account",
        amount: amount,
        type: "withdrawal",
        status: "pending"
      };
      
      setTransactions([newTransaction, ...transactions]);
      setPendingBalance(prev => prev + amount);
      setBalance(prev => prev - amount);
      setWithdrawAmount("");
      setIsWithdrawing(false);
      
      toast({
        title: "Withdrawal initiated",
        description: "Your withdrawal request has been submitted and is being processed."
      });
    }, 1500);
  };

  return {
    balance,
    pendingBalance,
    transactions,
    setTransactions,
    paymentMethods,
    setPaymentMethods,
    withdrawAmount,
    setWithdrawAmount,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isWithdrawing,
    handleWithdraw
  };
}
