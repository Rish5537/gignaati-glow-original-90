
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ModerateGigItem from "./ModerateGigItem";
import GigDetailsDialog from "./GigDetailsDialog";

const GigsModeration: React.FC = () => {
  const [gigs, setGigs] = useState<any[]>([]);
  const [gigSearchTerm, setGigSearchTerm] = useState("");
  const [filteredGigs, setFilteredGigs] = useState<any[]>([]);
  const [showGigDetailsDialog, setShowGigDetailsDialog] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any>(null);
  const [gigRequirements, setGigRequirements] = useState("");
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    fetchGigs();
  }, []);
  
  // Search and filter functions
  useEffect(() => {
    if (gigSearchTerm) {
      const filtered = gigs.filter(gig => 
        gig.title?.toLowerCase().includes(gigSearchTerm.toLowerCase()) || 
        gig.profiles?.full_name?.toLowerCase().includes(gigSearchTerm.toLowerCase())
      );
      setFilteredGigs(filtered);
    } else {
      setFilteredGigs(gigs);
    }
  }, [gigSearchTerm, gigs]);

  // Fetch gigs
  const fetchGigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          id,
          title,
          price,
          created_at,
          freelancer_id,
          profiles (id, full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get gig requirements
      const { data: requirementsData } = await supabase
        .from('gig_requirements')
        .select('gig_id, requirements');
      
      // Map requirements to gigs
      const gigsWithRequirements = data.map((gig: any) => {
        const requirement = requirementsData?.find((r: any) => r.gig_id === gig.id);
        return {
          ...gig,
          requirements: requirement?.requirements || ''
        };
      });
      
      setGigs(gigsWithRequirements);
      setFilteredGigs(gigsWithRequirements);
    } catch (error) {
      console.error("Error fetching gigs:", error);
      toast({
        title: "Error",
        description: "Failed to load gigs data",
        variant: "destructive"
      });
    }
  };

  // Handle view gig details
  const handleViewGigDetails = (gig: any) => {
    setSelectedGig(gig);
    setGigRequirements(gig.requirements || '');
    setShowGigDetailsDialog(true);
  };
  
  // Handle gig approval
  const handleApproveGig = async (gig: any) => {
    try {
      // Check if user exists
      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', gig.freelancer_id)
        .single();
      
      if (!user) {
        throw new Error("Creator not found");
      }
      
      // Assign creator role to the user if not already assigned
      const { data: hasCreatorRole } = await supabase.rpc('has_role', { 
        user_id: gig.freelancer_id,
        required_role: 'creator'
      });
      
      if (!hasCreatorRole) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: gig.freelancer_id,
            role: 'creator'
          });
      }
      
      // Send notification to user
      await supabase.from('notifications').insert({
        user_id: gig.freelancer_id,
        title: 'Gig Approved',
        message: `Your gig "${gig.title}" has been approved and is now live.`,
        related_entity_type: 'gig',
        related_entity_id: gig.id
      });
      
      toast({
        title: "Gig approved",
        description: `The gig "${gig.title}" has been approved and the creator has been notified.`
      });
      
      // Refresh data
      fetchGigs();
    } catch (error) {
      console.error("Error approving gig:", error);
      toast({
        title: "Error",
        description: "Failed to approve gig",
        variant: "destructive"
      });
    }
  };
  
  // Handle gig rejection
  const handleRejectGig = async (gig: any) => {
    try {
      // Send notification to user
      await supabase.from('notifications').insert({
        user_id: gig.freelancer_id,
        title: 'Gig Rejected',
        message: `Your gig "${gig.title}" has been rejected. Please review and resubmit.`,
        related_entity_type: 'gig',
        related_entity_id: gig.id
      });
      
      toast({
        title: "Gig rejected",
        description: `The gig "${gig.title}" has been rejected and the creator has been notified.`
      });
      
      // Refresh data
      fetchGigs();
    } catch (error) {
      console.error("Error rejecting gig:", error);
      toast({
        title: "Error",
        description: "Failed to reject gig",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Gigs Moderation</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search gigs..."
              className="max-w-xs"
              value={gigSearchTerm}
              onChange={(e) => setGigSearchTerm(e.target.value)}
            />
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGigs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {gigSearchTerm ? "No gigs matching your search" : "No gigs found"}
              </div>
            ) : (
              filteredGigs.map((gig) => (
                <ModerateGigItem 
                  key={gig.id}
                  title={gig.title}
                  type="New"
                  creator={gig.profiles?.full_name || "Unknown Creator"}
                  date={new Date(gig.created_at).toLocaleDateString()}
                  onViewDetails={() => handleViewGigDetails(gig)}
                  onApprove={() => handleApproveGig(gig)}
                  onReject={() => handleRejectGig(gig)}
                />
              ))
            )}
          </div>
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
