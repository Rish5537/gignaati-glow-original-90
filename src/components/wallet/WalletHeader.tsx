
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface WalletHeaderProps {
  title?: string;
  description?: string;
}

const WalletHeader = ({ 
  title = "Wallet & Payments", 
  description = "Manage your finances and payment methods" 
}: WalletHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => toast({ 
            title: "Refreshed", 
            description: "Your balances have been updated." 
          })}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/wallet-settings")}
        >
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Button>
      </div>
    </div>
  );
};

export default WalletHeader;
