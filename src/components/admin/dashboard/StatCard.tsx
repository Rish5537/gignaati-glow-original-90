
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <div className="flex items-center text-xs mt-2">
              {trend === "up" ? (
                <ChevronUp className="h-3 w-3 text-green-500" />
              ) : trend === "down" ? (
                <ChevronDown className="h-3 w-3 text-red-500" />
              ) : null}
              <span className={`ml-1 ${
                trend === "up" ? "text-green-500" : 
                trend === "down" ? "text-red-500" : 
                "text-gray-500"
              }`}>
                {change}
              </span>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-md">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
