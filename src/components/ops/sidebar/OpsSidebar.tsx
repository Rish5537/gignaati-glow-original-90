
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LayoutDashboard, Shield, Users, FileText, Activity } from "lucide-react";
import SidebarItem from "./SidebarItem";

interface OpsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

const OpsSidebar: React.FC<OpsSidebarProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  return (
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
  );
};

export default OpsSidebar;
