
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Landmark, WalletIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense" | "withdrawal" | "deposit";
  status: "completed" | "pending" | "failed";
}

interface TransactionTableProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

const TransactionTable = ({ transactions, formatCurrency, formatDate }: TransactionTableProps) => {
  const { toast } = useToast();
  
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
        <Button 
          variant="outline" 
          onClick={() => toast({ 
            title: "Coming soon", 
            description: "View all transactions feature is coming soon." 
          })}
        >
          View All Transactions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionTable;
