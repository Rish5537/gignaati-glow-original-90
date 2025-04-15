
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KRA, OpsAssignment } from "@/services/types/rbac";
import { getAllKRAs, getOpsAssignments, assignKRA, removeKRAAssignment } from "@/services/OpsService";
import { supabase } from "@/integrations/supabase/client";

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
      const users = data.map(item => ({
        id: item.user_id,
        full_name: item.profiles?.full_name
      }));

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

  // Group assignments by user_id for display
  type GroupedAssignments = Record<string, { user_id: string, full_name: string | null, assignments: OpsAssignment[] }>;
  
  const groupedAssignments: GroupedAssignments = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.user_id]) {
      const user = opsTeamMembers.find(u => u.id === assignment.user_id);
      acc[assignment.user_id] = {
        user_id: assignment.user_id,
        full_name: user?.full_name || null,
        assignments: []
      };
    }
    
    acc[assignment.user_id].assignments.push(assignment);
    return acc;
  }, {} as GroupedAssignments);

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
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : Object.values(groupedAssignments).length > 0 ? (
            <div className="space-y-6">
              {Object.values(groupedAssignments).map(({ user_id, full_name, assignments }) => (
                <div key={user_id} className="border rounded-md p-4">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                      {full_name?.charAt(0) || "U"}
                    </div>
                    <div className="font-medium">
                      {full_name || "Unknown User"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Assigned KRAs:</div>
                    <div className="space-y-2">
                      {assignments.map(assignment => {
                        const kra = kras.find(k => k.id === assignment.kra_id);
                        
                        return (
                          <div key={assignment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                            <div>
                              <div className="font-medium">{kra?.name || 'Unknown KRA'}</div>
                              {kra?.description && (
                                <div className="text-sm text-gray-500">{kra.description}</div>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveAssignment(assignment.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No assignments found</h3>
              <p className="text-gray-500 mt-2">
                Click "Assign KRA" to assign Key Responsibility Areas to ops team members.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign KRA</DialogTitle>
            <DialogDescription>
              Assign a Key Responsibility Area to an operations team member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <Select onValueChange={(value) => setSelectedUser(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {opsTeamMembers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">KRA</label>
              <Select onValueChange={(value) => setSelectedKRA(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a KRA" />
                </SelectTrigger>
                <SelectContent>
                  {kras.map(kra => (
                    <SelectItem key={kra.id} value={kra.id}>
                      {kra.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignKRA}>
              Assign KRA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpsAssignmentManagement;
