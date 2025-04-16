
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CreditCard,
  Download,
  DollarSign,
  HelpCircle,
  Landmark,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Wallet as WalletIcon
} from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense" | "withdrawal" | "deposit";
  status: "completed" | "pending" | "failed";
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal";
  name: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
}

const Wallet = () => {
  const [balance, setBalance] = useState(2458.75);
  const [pendingBalance, setPendingBalance] = useState(350.00);
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
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0].id);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const navigate = useNavigate();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case "income":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case "expense":
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case "withdrawal":
        return <Landmark className="h-4 w-4 text-blue-500" />;
      case "deposit":
        return <WalletIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case "income":
        return "text-green-600";
      case "expense":
      case "withdrawal":
        return "text-red-600";
      case "deposit":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case "pending":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case "failed":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wallet & Payments</h1>
              <p className="text-gray-600">Manage your finances and payment methods</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Refreshed", description: "Your balances have been updated." })}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/wallet-settings")}>
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <WalletIcon className="mr-2" />
                  Available Balance
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Funds ready for withdrawal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{formatCurrency(balance)}</div>
                <div className="mt-2 text-sm text-blue-100">
                  <span className="inline-flex items-center mr-4">
                    <AlertCircle className="h-3 w-3 mr-1" /> 
                    Pending: {formatCurrency(pendingBalance)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-blue-500 pt-4">
                <div className="flex gap-2 w-full">
                  <Button variant="secondary" className="flex-1">
                    <Send className="h-4 w-4 mr-2" /> Send
                  </Button>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 flex-1">
                    <Download className="h-4 w-4 mr-2" /> Withdraw
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Withdraw Card */}
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
          </div>
          
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your payment and withdrawal history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {formatDate(transaction.date)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="mr-2">
                                  {getTransactionIcon(transaction.type)}
                                </div>
                                {transaction.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(transaction.status)}
                            </TableCell>
                            <TableCell className={`text-right font-medium ${getTransactionColor(transaction.type)}`}>
                              {transaction.type === "withdrawal" || transaction.type === "expense" ? "- " : ""}
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" onClick={() => toast({ title: "Coming soon", description: "View all transactions feature is coming soon." })}>
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment-methods" className="pt-4">
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
                  <Button className="w-full" variant="outline" onClick={() => toast({ title: "Coming soon", description: "Add new payment method feature is coming soon." })}>
                    <Plus className="h-4 w-4 mr-2" /> Add New Payment Method
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;
