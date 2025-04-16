
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import AccessDenied from '@/components/ops/AccessDenied';
import { Card, CardContent } from '@/components/ui/card';
import DisputeList from '@/components/disputes/DisputeList';
import FlaggedContentList from '@/components/moderation/FlaggedContentList';
import UserTrustList from '@/components/trust/UserTrustList';

const DisputesTrust = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('disputes');

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trust & Safety Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
          <TabsTrigger value="users">User Trust Controls</TabsTrigger>
        </TabsList>
        
        <TabsContent value="disputes">
          <Card>
            <CardContent className="pt-6">
              <DisputeList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flagged">
          <Card>
            <CardContent className="pt-6">
              <FlaggedContentList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardContent className="pt-6">
              <UserTrustList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DisputesTrust;
