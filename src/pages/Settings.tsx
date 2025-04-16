
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationTemplates from '@/components/settings/NotificationTemplates';
import APIKeyManagement from '@/components/settings/APIKeyManagement';
import SystemSettings from '@/components/settings/SystemSettings';
import WebhookManagement from '@/components/settings/WebhookManagement';
import { useAuth } from '@/hooks/useAuth';
import AccessDenied from '@/components/ops/AccessDenied';

const Settings = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('system-settings');

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Configuration</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="system-settings">System Settings</TabsTrigger>
          <TabsTrigger value="notification-templates">Notification Templates</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system-settings">
          <SystemSettings />
        </TabsContent>
        
        <TabsContent value="notification-templates">
          <NotificationTemplates />
        </TabsContent>
        
        <TabsContent value="api-keys">
          <APIKeyManagement />
        </TabsContent>
        
        <TabsContent value="webhooks">
          <WebhookManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
