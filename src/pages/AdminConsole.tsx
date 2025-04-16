
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMainContent from "@/components/admin/AdminMainContent";

const AdminConsole = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  // Redirect to auth if not admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (user) {
        if (!isAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin console.",
            variant: "destructive"
          });
          navigate('/');
        }
      } else {
        // Not logged in
        navigate('/auth');
      }
    };
    
    checkAdminAccess();
  }, [user, navigate, isAdmin, toast]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8 flex-grow">
        <div className="border-b pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Console</h1>
              <p className="text-gray-500">Manage your platform and users</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-700">All Systems Operational</Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Main Content */}
          <AdminMainContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminConsole;
