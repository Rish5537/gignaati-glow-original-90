
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";

interface ModerateGigItemProps {
  title: string;
  type: string;
  creator: string;
  date: string;
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const ModerateGigItem: React.FC<ModerateGigItemProps> = ({
  title,
  type,
  creator,
  date,
  onViewDetails,
  onApprove,
  onReject
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{title}</h3>
              <Badge variant="outline">{type}</Badge>
            </div>
            <p className="text-sm text-gray-500">
              Created by <span className="font-medium">{creator}</span> on {date}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onViewDetails}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={onApprove}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={onReject}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModerateGigItem;
