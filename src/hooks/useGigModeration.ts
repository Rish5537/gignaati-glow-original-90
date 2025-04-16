
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GigWithProfile {
  id: string;
  title: string;
  price: number;
  created_at: string;
  freelancer_id: string;
  profiles?: {
    id: string;
    full_name: string | null;
  };
  requirements?: string;
}

export const useGigModeration = () => {
  const [gigs, setGigs] = useState<GigWithProfile[]>([]);
  const [gigSearchTerm, setGigSearchTerm] = useState("");
  const [filteredGigs, setFilteredGigs] = useState<GigWithProfile[]>([]);
  const [selectedGig, setSelectedGig] = useState<GigWithProfile | null>(null);
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
      const { data: requirementsData, error: reqError } = await supabase
        .from('gig_requirements')
        .select('gig_id, requirements');
      
      if (reqError) {
        console.error("Error fetching requirements:", reqError);
      }
      
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
  const handleViewGigDetails = (gig: GigWithProfile) => {
    setSelectedGig(gig);
    setGigRequirements(gig.requirements || '');
  };
  
  // Handle gig approval
  const handleApproveGig = async (gig: GigWithProfile) => {
    try {
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', gig.freelancer_id)
        .single();
      
      if (userError) {
        console.error("Error checking user:", userError);
        throw new Error("Creator not found");
      }
      
      // Assign creator role to the user if not already assigned
      const { data: hasCreatorRole, error: roleError } = await supabase.rpc('has_role', { 
        user_id: gig.freelancer_id,
        required_role: 'creator'
      });
      
      if (roleError) {
        console.error("Error checking role:", roleError);
      }
      
      if (!hasCreatorRole) {
        const { error: assignError } = await supabase
          .from('user_roles')
          .insert({
            user_id: gig.freelancer_id,
            role: 'creator'
          });
          
        if (assignError) {
          console.error("Error assigning role:", assignError);
        }
      }
      
      // Send notification to user
      const { error: notifyError } = await supabase
        .from('notifications')
        .insert({
          user_id: gig.freelancer_id,
          title: 'Gig Approved',
          message: `Your gig "${gig.title}" has been approved and is now live.`,
          related_entity_type: 'gig',
          related_entity_id: gig.id
        });
      
      if (notifyError) {
        console.error("Error sending notification:", notifyError);
      }
      
      toast({
        title: "Gig approved",
        description: `The gig "${gig.title}" has been approved and the creator has been notified.`
      });
      
      // Refresh data
      fetchGigs();
    } catch (error: any) {
      console.error("Error approving gig:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve gig",
        variant: "destructive"
      });
    }
  };
  
  // Handle gig rejection
  const handleRejectGig = async (gig: GigWithProfile) => {
    try {
      // Send notification to user
      const { error: notifyError } = await supabase
        .from('notifications')
        .insert({
          user_id: gig.freelancer_id,
          title: 'Gig Rejected',
          message: `Your gig "${gig.title}" has been rejected. Please review and resubmit.`,
          related_entity_type: 'gig',
          related_entity_id: gig.id
        });
      
      if (notifyError) {
        console.error("Error sending notification:", notifyError);
      }
      
      toast({
        title: "Gig rejected",
        description: `The gig "${gig.title}" has been rejected and the creator has been notified.`
      });
      
      // Refresh data
      fetchGigs();
    } catch (error: any) {
      console.error("Error rejecting gig:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject gig",
        variant: "destructive"
      });
    }
  };

  return {
    gigs: filteredGigs,
    gigSearchTerm,
    setGigSearchTerm,
    selectedGig,
    setSelectedGig,
    gigRequirements,
    handleViewGigDetails,
    handleApproveGig,
    handleRejectGig
  };
};

export type { GigWithProfile };
