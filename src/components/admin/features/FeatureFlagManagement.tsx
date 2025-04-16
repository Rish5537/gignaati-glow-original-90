
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FeatureFlagItem from "./FeatureFlagItem";

const FeatureFlagManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FeatureFlagItem 
            name="New Dashboard UI" 
            description="Enable the redesigned dashboard interface"
            enabled={true}
          />
          <FeatureFlagItem 
            name="AI Agent Marketplace" 
            description="Allow users to buy and sell pre-built AI agents"
            enabled={true}
          />
          <FeatureFlagItem 
            name="GPT-4 Integration" 
            description="Enable GPT-4 for premium users"
            enabled={false}
          />
          <FeatureFlagItem 
            name="Multi-user Collaboration" 
            description="Enable real-time collaboration features"
            enabled={false}
          />
          <FeatureFlagItem 
            name="Affiliate Program" 
            description="Enable user referral and affiliate features"
            enabled={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureFlagManagement;
