
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import KRAManagement from "@/components/ops/KRAManagement";
import UserRoleManagement from "@/components/ops/UserRoleManagement";
import OpsAssignmentManagement from "@/components/ops/OpsAssignmentManagement";
import TaskManagement from "@/components/ops/TaskManagement";
import AuditLogViewer from "@/components/ops/AuditLogViewer";
import DashboardStats from "./dashboard/DashboardStats";

interface OpsMainContentProps {
  activeTab: string;
}

const OpsMainContent: React.FC<OpsMainContentProps> = ({ activeTab }) => {
  return (
    <div className="flex-1">
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="dashboard" className="m-0">
          <DashboardStats />
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
  );
};

export default OpsMainContent;
