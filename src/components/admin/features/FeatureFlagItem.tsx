
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface FeatureFlagItemProps {
  name: string;
  description: string;
  enabled: boolean;
}

const FeatureFlagItem: React.FC<FeatureFlagItemProps> = ({ name, description, enabled }) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-2 rounded-md">
          <Zap className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{name}</h3>
            <Badge className={isEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {isEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
    </div>
  );
};

export default FeatureFlagItem;
