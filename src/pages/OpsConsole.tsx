
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import OpsSidebar from "@/components/ops/sidebar/OpsSidebar";
import OpsPageHeader from "@/components/ops/OpsPageHeader";
import OpsMainContent from "@/components/ops/OpsMainContent";
import OpsFooter from "@/components/ops/OpsFooter";
import AccessDenied from "@/components/ops/AccessDenied";

const OpsConsole = () => {
  const { isAdmin, isOpsTeam } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  if (!isAdmin && !isOpsTeam) {
    return <AccessDenied />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8 flex-grow">
        <OpsPageHeader />
        
        <div className="flex flex-col md:flex-row gap-6">
          <OpsSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isAdmin={isAdmin} 
          />
          <OpsMainContent activeTab={activeTab} />
        </div>
      </div>
      
      <OpsFooter />
    </div>
  );
};

export default OpsConsole;
