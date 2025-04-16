
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";
import UserManagement from "@/components/admin/users/UserManagement";
import GigsModeration from "@/components/admin/gigs/GigsModeration";
import FeatureFlagManagement from "@/components/admin/features/FeatureFlagManagement";

interface AdminMainContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminMainContent: React.FC<AdminMainContentProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="dashboard" className="m-0">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="users" className="m-0">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="gigs" className="m-0">
          <GigsModeration />
        </TabsContent>
        
        <TabsContent value="features" className="m-0">
          <FeatureFlagManagement />
        </TabsContent>
        
        <TabsContent value="reports" className="m-0">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Reported Content</h3>
            </div>
            <div className="card-body">
              <p className="text-muted-foreground text-center">This tab is under development.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="database" className="m-0">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Database Management</h3>
            </div>
            <div className="card-body">
              <p className="text-muted-foreground text-center">This tab is under development.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="apikeys" className="m-0">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">API Key Management</h3>
            </div>
            <div className="card-body">
              <p className="text-muted-foreground text-center">This tab is under development.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="m-0">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">System Health</h3>
            </div>
            <div className="card-body">
              <p className="text-muted-foreground text-center">This tab is under development.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="m-0">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Analytics Dashboard</h3>
            </div>
            <div className="card-body">
              <p className="text-muted-foreground text-center">This tab is under development.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="m-0">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Security Settings</h3>
            </div>
            <div className="card-body">
              <p className="text-muted-foreground text-center">This tab is under development.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMainContent;
