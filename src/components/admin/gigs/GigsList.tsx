
import React from 'react';
import type { GigWithProfile } from "@/hooks/useGigModeration";
import ModerateGigItem from "./ModerateGigItem";

interface GigsListProps {
  gigs: GigWithProfile[];
  searchTerm: string;
  onViewDetails: (gig: GigWithProfile) => void;
  onApprove: (gig: GigWithProfile) => void;
  onReject: (gig: GigWithProfile) => void;
}

const GigsList: React.FC<GigsListProps> = ({ 
  gigs, 
  searchTerm, 
  onViewDetails, 
  onApprove, 
  onReject 
}) => {
  if (gigs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchTerm ? "No gigs matching your search" : "No gigs found"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {gigs.map((gig) => (
        <ModerateGigItem 
          key={gig.id}
          title={gig.title}
          type="New"
          creator={gig.profiles?.full_name || "Unknown Creator"}
          date={new Date(gig.created_at).toLocaleDateString()}
          onViewDetails={() => onViewDetails(gig)}
          onApprove={() => onApprove(gig)}
          onReject={() => onReject(gig)}
        />
      ))}
    </div>
  );
};

export default GigsList;
