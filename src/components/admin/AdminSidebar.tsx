
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Terminal } from "lucide-react";
import SidebarItem from "@/components/admin/sidebar/SidebarItem";
import { 
  LayoutDashboard,
  Users,
  FileText,
  Flag,
  Database,
  Key,
  Sliders,
  HardDrive,
  Activity,
  Shield
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full md:w-64 space-y-4">
      <Card>
        <CardContent className="p-0">
          <nav className="py-2">
            <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activeTab === "dashboard"} 
              onClick={() => onTabChange("dashboard")} 
            />
            <SidebarItem 
              icon={<Users size={18} />} 
              label="User Management" 
              active={activeTab === "users"} 
              onClick={() => onTabChange("users")} 
            />
            <SidebarItem 
              icon={<FileText size={18} />} 
              label="Gigs Moderation" 
              active={activeTab === "gigs"} 
              onClick={() => onTabChange("gigs")} 
            />
            <SidebarItem 
              icon={<Flag size={18} />} 
              label="Reported Content" 
              active={activeTab === "reports"} 
              onClick={() => onTabChange("reports")} 
              badge="5"
            />
            <SidebarItem 
              icon={<Database size={18} />} 
              label="Database" 
              active={activeTab === "database"} 
              onClick={() => onTabChange("database")} 
            />
            <SidebarItem 
              icon={<Key size={18} />} 
              label="API Keys" 
              active={activeTab === "apikeys"} 
              onClick={() => onTabChange("apikeys")} 
            />
            <SidebarItem 
              icon={<Sliders size={18} />} 
              label="Feature Flags" 
              active={activeTab === "features"} 
              onClick={() => onTabChange("features")} 
            />
            <SidebarItem 
              icon={<HardDrive size={18} />} 
              label="System Health" 
              active={activeTab === "health"} 
              onClick={() => onTabChange("health")} 
            />
            <SidebarItem 
              icon={<Activity size={18} />} 
              label="Analytics" 
              active={activeTab === "analytics"} 
              onClick={() => onTabChange("analytics")} 
            />
            <SidebarItem 
              icon={<Shield size={18} />} 
              label="Security" 
              active={activeTab === "security"} 
              onClick={() => onTabChange("security")} 
            />
          </nav>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">AI Admin Assistant</p>
            <div className="flex space-x-2">
              <Input
                placeholder="Run command or query..."
                className="h-9 text-sm"
              />
              <Button size="sm" className="h-9 px-3 bg-black hover:bg-gray-800">
                <Terminal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSidebar;
