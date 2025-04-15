
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KRA, OpsAssignment } from "@/services/types/rbac";
import { getAllKRAs } from "@/services/KRAService";
import { getOpsAssignments, assignKRA, removeKRAAssignment } from "@/services/AssignmentService";
import { supabase } from "@/integrations/supabase/client";
import AssignmentList from "./assignment/AssignmentList";
import AssignmentDialog from "./assignment/AssignmentDialog";

interface User {
  id: string;
  full_name: string | null;
}

const OpsAssignmentManagement = () => {
  const [assignments, setAssignments] = useState<OpsAssignment[]>([]);
  const [kras, setKras] = useState<KRA[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedKRA, setSelectedKRA] = useState<string | null>(null);
  const [opsTeamMembers, setOpsTeamMembers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignments();
    fetchKRAs();
    fetchOpsTeamMembers();
  }, []);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await getOpsAssignments();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load assignments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKRAs = async () => {
    try {
      const data = await getAllKRAs();
      setKras(data);
    } catch (error) {
      console.error("Error fetching KRAs:", error);
      toast({
        title: "Error",
        description: "Failed to load KRAs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchOpsTeamMembers = async () => {
    try {
      // Get users with the ops_team role
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profiles:user_id (
            id, 
            full_name
          )
        `)
        .eq('role', 'ops_team');

      if (error) throw error;

      // Transform to user objects
      const users: User[] = [];
      
      for (const item of data) {
        if (item.profiles) {
          users.push({
            id: item.user_id,
            full_name: (item.profiles as any).full_name || null
          });
        } else {
          users.push({
            id: item.user_id,
            full_name: null
          });
        }
      }

      setOpsTeamMembers(users);
    } catch (error) {
      console.error("Error fetching ops team members:", error);
      toast({
        title: "Error",
        description: "Failed to load ops team members.",
        variant: "destructive",
      });
    }
  };

  const handleAssignKRA = async () => {
    if (!selectedUser || !selectedKRA) {
      toast({
        title: "Error",
        description: "Please select both a user and a KRA.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await assignKRA(selectedUser, selectedKRA);
      
      if (success) {
        toast({
          title: "Success",
          description: "KRA assigned successfully.",
        });
        
        setDialogOpen(false);
        fetchAssignments();
      } else {
        throw new Error("Failed to assign KRA");
      }
    } catch (error) {
      console.error("Error assigning KRA:", error);
      toast({
        title: "Error",
        description: "Failed to assign KRA. The user may already be assigned to this KRA.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) {
      return;
    }
    
    try {
      const success = await removeKRAAssignment(assignmentId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Assignment removed successfully.",
        });
        
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      } else {
        throw new Error("Failed to remove assignment");
      }
    } catch (error) {
      console.error("Error removing assignment:", error);
      toast({
        title: "Error",
        description: "Failed to remove assignment.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ops Team Assignments</CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            Assign KRA
          </Button>
        </CardHeader>
        <CardContent>
          <AssignmentList
            assignments={assignments}
            kras={kras}
            opsTeamMembers={opsTeamMembers}
            isLoading={isLoading}
            onRemoveAssignment={handleRemoveAssignment}
          />
        </CardContent>
      </Card>
      
      <AssignmentDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        opsTeamMembers={opsTeamMembers}
        kras={kras}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedKRA={selectedKRA}
        setSelectedKRA={setSelectedKRA}
        onAssignKRA={handleAssignKRA}
      />
    </>
  );
};

export default OpsAssignmentManagement;
