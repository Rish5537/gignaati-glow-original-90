
import React from 'react';
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface HealthItemProps {
  name: string;
  status: "healthy" | "warning" | "critical";
  metric: string;
  description: string;
}

const HealthItem: React.FC<HealthItemProps> = ({ name, status, metric, description }) => {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
      <div className="flex items-center">
        {status === "healthy" ? (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <ShieldCheck className="h-4 w-4 text-green-600" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
        )}
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium ${
          status === "healthy" ? "text-green-600" : 
          status === "warning" ? "text-amber-600" : 
          "text-red-600"
        }`}>
          {metric}
        </div>
        <div className="text-xs text-gray-500 capitalize">{status}</div>
      </div>
    </div>
  );
};

export default HealthItem;
