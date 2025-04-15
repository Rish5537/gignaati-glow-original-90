
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps { 
  title: string; 
  value: string; 
  category: string; 
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  category 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{category}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
