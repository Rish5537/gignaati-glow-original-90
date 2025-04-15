
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { OpsTask, KRA } from "@/services/types/rbac";
import { getOpsTasks } from "@/services/TaskService";
import { getAllKRAs } from "@/services/KRAService";
import { useAuth } from "@/hooks/useAuth";

// Import the new component
import TaskFilter from "./task/TaskFilter";
import TaskStatusSummary from "./task/TaskStatusSummary";
import TaskList from "./task/TaskList";

const TaskManagement = () => {
  const { user, isAdmin, isOpsTeam } = useAuth();
  const [tasks, setTasks] = useState<OpsTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<OpsTask[]>([]);
  const [kras, setKras] = useState<KRA[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kraFilter, setKraFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchKRAs();
  }, [user]);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter, kraFilter, searchQuery]);

  const fetchTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let fetchedTasks: OpsTask[] = [];
      
      if (isAdmin) {
        // Admins can see all tasks
        fetchedTasks = await getOpsTasks();
      } else if (isOpsTeam) {
        // Ops team members see tasks assigned to them or to their KRAs
        fetchedTasks = await getOpsTasks({ userId: user.id });
      }
      
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKRAs = async () => {
    const data = await getAllKRAs();
    setKras(data);
  };

  const filterTasks = () => {
    let filtered = [...tasks];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (kraFilter !== "all") {
      filtered = filtered.filter(task => task.kra_id === kraFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        task => 
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredTasks(filtered);
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/admin/ops/tasks/${taskId}`);
  };

  const getTaskStatusCount = (status: string) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <CardTitle>Task Management</CardTitle>
        <Button onClick={() => navigate('/admin/ops/tasks/new')}>
          Create New Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <TaskStatusSummary 
            totalCount={tasks.length}
            pendingCount={getTaskStatusCount('pending')}
            inProgressCount={getTaskStatusCount('in_progress')}
            completedCount={getTaskStatusCount('completed')}
          />
          
          <TaskFilter 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            kraFilter={kraFilter}
            setKraFilter={setKraFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            kras={kras}
          />
        </div>
        
        <TaskList 
          isLoading={isLoading}
          tasks={tasks}
          filteredTasks={filteredTasks}
          onViewTask={handleViewTask}
        />
      </CardContent>
    </Card>
  );
};

export default TaskManagement;
