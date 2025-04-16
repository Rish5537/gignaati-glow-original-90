
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WalletHeader from "@/components/wallet/WalletHeader";
import BalanceCard from "@/components/wallet/BalanceCard";
import WithdrawCard from "@/components/wallet/WithdrawCard";
import WalletTabs from "@/components/wallet/WalletTabs";
import useWallet from "@/hooks/useWallet";
import { formatCurrency, formatDate } from "@/components/wallet/utils";

const Wallet = () => {
  const {
    balance,
    pendingBalance,
    transactions,
    paymentMethods,
    setPaymentMethods,
    withdrawAmount,
    setWithdrawAmount,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isWithdrawing,
    handleWithdraw
  } = useWallet();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          <WalletHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <BalanceCard 
              balance={balance} 
              pendingBalance={pendingBalance} 
              formatCurrency={formatCurrency} 
            />
            
            {/* Withdraw Card */}
            <WithdrawCard 
              withdrawAmount={withdrawAmount}
              setWithdrawAmount={setWithdrawAmount}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              paymentMethods={paymentMethods}
              isWithdrawing={isWithdrawing}
              handleWithdraw={handleWithdraw}
            />
          </div>
          
          <WalletTabs 
            transactions={transactions}
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;
