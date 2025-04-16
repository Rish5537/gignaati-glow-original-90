
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletIcon, AlertCircle, Send, Download } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  pendingBalance: number;
  formatCurrency: (amount: number) => string;
}

const BalanceCard = ({ balance, pendingBalance, formatCurrency }: BalanceCardProps) => {
  return (
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
  );
};

export default BalanceCard;
