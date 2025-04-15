
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const OpsPageHeader: React.FC = () => {
  return (
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
  );
};

export default OpsPageHeader;
