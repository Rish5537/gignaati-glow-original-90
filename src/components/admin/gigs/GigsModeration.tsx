
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GigSearchBar from "./GigSearchBar";
import GigsList from "./GigsList";
import GigDetailsDialog from "./GigDetailsDialog";
import { useGigModeration } from "@/hooks/useGigModeration";

const GigsModeration: React.FC = () => {
  const [showGigDetailsDialog, setShowGigDetailsDialog] = useState(false);
  const {
    gigs,
    gigSearchTerm,
    setGigSearchTerm,
    selectedGig,
    gigRequirements,
    handleViewGigDetails,
    handleApproveGig,
    handleRejectGig
  } = useGigModeration();

  const onViewDetails = (gig: any) => {
    handleViewGigDetails(gig);
    setShowGigDetailsDialog(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Gigs Moderation</CardTitle>
          <GigSearchBar 
            searchTerm={gigSearchTerm} 
            onSearchChange={setGigSearchTerm} 
          />
        </CardHeader>
        <CardContent>
          <GigsList 
            gigs={gigs}
            searchTerm={gigSearchTerm}
            onViewDetails={onViewDetails}
            onApprove={handleApproveGig}
            onReject={handleRejectGig}
          />
        </CardContent>
      </Card>
      
      <GigDetailsDialog 
        showDialog={showGigDetailsDialog}
        setShowDialog={setShowGigDetailsDialog}
        selectedGig={selectedGig}
        gigRequirements={gigRequirements}
      />
    </>
  );
};

export default GigsModeration;
