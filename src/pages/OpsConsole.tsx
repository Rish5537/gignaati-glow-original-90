
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  FileText,
  Key,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Sliders,
  Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KRAManagement from "@/components/ops/KRAManagement";
import UserRoleManagement from "@/components/ops/UserRoleManagement";
import OpsAssignmentManagement from "@/components/ops/OpsAssignmentManagement";
import TaskManagement from "@/components/ops/TaskManagement";
import AuditLogViewer from "@/components/ops/AuditLogViewer";
import { useAuth } from "@/hooks/useAuth";

const OpsConsole = () => {
  const { isAdmin, isOpsTeam, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  if (!isAdmin && !isOpsTeam) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-8 flex-1 flex items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-gray-500 mb-6">
                You do not have permission to access the Operations Console. Please contact an administrator if you believe this is an error.
              </p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8 flex-grow">
        <div className="border-b pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Operations Console</h1>
              <p className="text-gray-500">Manage marketplace operations and team tasks</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-700">Operations Active</Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-0">
                <nav className="py-2">
                  <SidebarItem 
                    icon={<LayoutDashboard size={18} />} 
                    label="Dashboard" 
                    active={activeTab === "dashboard"} 
                    onClick={() => setActiveTab("dashboard")} 
                  />
                  
                  {isAdmin && (
                    <SidebarItem 
                      icon={<Users size={18} />} 
                      label="User Roles" 
                      active={activeTab === "roles"} 
                      onClick={() => setActiveTab("roles")} 
                    />
                  )}
                  
                  {isAdmin && (
                    <SidebarItem 
                      icon={<Shield size={18} />} 
                      label="KRA Management" 
                      active={activeTab === "kras"} 
                      onClick={() => setActiveTab("kras")} 
                    />
                  )}
                  
                  {isAdmin && (
                    <SidebarItem 
                      icon={<Users size={18} />} 
                      label="Team Assignments" 
                      active={activeTab === "assignments"} 
                      onClick={() => setActiveTab("assignments")} 
                    />
                  )}
                  
                  <SidebarItem 
                    icon={<FileText size={18} />} 
                    label="Task Management" 
                    active={activeTab === "tasks"} 
                    onClick={() => setActiveTab("tasks")} 
                  />
                  
                  <SidebarItem 
                    icon={<Activity size={18} />} 
                    label="Audit Logs" 
                    active={activeTab === "logs"} 
                    onClick={() => setActiveTab("logs")} 
                  />
                </nav>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Quick Search</p>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search tasks, users..."
                      className="h-9 text-sm"
                    />
                    <Button size="sm" className="h-9 px-3 bg-black hover:bg-gray-800">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="dashboard" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard 
                    title="Tasks Assigned" 
                    value="14"
                    category="Operations"
                  />
                  <StatCard 
                    title="Tasks Completed" 
                    value="23"
                    category="This Month"
                  />
                  <StatCard 
                    title="Pending Approvals" 
                    value="7"
                    category="Creator Verifications"
                  />
                </div>
                
                <div className="space-y-6">
                  <TaskManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="roles" className="m-0">
                <UserRoleManagement />
              </TabsContent>
              
              <TabsContent value="kras" className="m-0">
                <KRAManagement />
              </TabsContent>
              
              <TabsContent value="assignments" className="m-0">
                <OpsAssignmentManagement />
              </TabsContent>
              
              <TabsContent value="tasks" className="m-0">
                <TaskManagement />
              </TabsContent>
              
              <TabsContent value="logs" className="m-0">
                <AuditLogViewer />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              Operations Console v1.0.0 | Last updated: April 15, 2025
            </p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <Link to="/ops/help" className="text-sm text-gray-500 hover:text-gray-800">Help</Link>
              <Link to="/ops/security" className="text-sm text-gray-500 hover:text-gray-800">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  badge 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void; 
  badge?: string; 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100 ${
        active ? "bg-gray-100 font-medium" : "text-gray-700"
      }`}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 text-xs font-medium text-white bg-red-500 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

const StatCard = ({ 
  title, 
  value, 
  category 
}: { 
  title: string; 
  value: string; 
  category: string; 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{category}</p>
      </CardContent>
    </Card>
  );
};

export default OpsConsole;
