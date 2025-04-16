
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TrustScoreBadgeProps {
  score: number;
}

export const TrustScoreBadge = ({ score }: TrustScoreBadgeProps) => {
  if (score >= 80) {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Trust {score}%</Badge>;
  } else if (score >= 50) {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Trust {score}%</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Low Trust {score}%</Badge>;
  }
};
