
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OpsTask, KRA } from "@/services/types/rbac";
// Update imports to use the new service files directly
import { getOpsTasks } from "@/services/TaskService";
import { getAllKRAs } from "@/services/KRAService";
import { useAuth } from "@/hooks/useAuth";

const statusIcons = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  in_progress: <ArrowUpRight className="h-4 w-4 text-blue-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  escalated: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  escalated: "bg-red-100 text-red-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  critical: "bg-red-100 text-red-800",
};

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-500 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-500 mb-1">Pending</div>
              <div className="text-2xl font-bold">{getTaskStatusCount('pending')}</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-500 mb-1">In Progress</div>
              <div className="text-2xl font-bold">{getTaskStatusCount('in_progress')}</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-500 mb-1">Completed</div>
              <div className="text-2xl font-bold">{getTaskStatusCount('completed')}</div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-1/3"
            />
            
            <div className="flex space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={kraFilter} onValueChange={setKraFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by KRA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All KRAs</SelectItem>
                  {kras.map(kra => (
                    <SelectItem key={kra.id} value={kra.id}>
                      {kra.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="border rounded-md p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusColors[task.status as keyof typeof statusColors] || "bg-gray-100"}>
                        <span className="flex items-center">
                          {statusIcons[task.status as keyof typeof statusIcons]}
                          <span className="ml-1 capitalize">{task.status}</span>
                        </span>
                      </Badge>
                      
                      <Badge className={priorityColors[task.priority as keyof typeof priorityColors] || "bg-gray-100"}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      
                      {task.kra && (
                        <Badge variant="outline">{task.kra.name}</Badge>
                      )}
                    </div>
                    
                    <h3 className="font-medium text-lg">{task.title}</h3>
                    
                    {task.description && (
                      <p className="text-gray-500 text-sm line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-x-4 text-sm text-gray-500">
                      {task.assignee && (
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                            {task.assignee.full_name?.charAt(0) || "U"}
                          </div>
                          <span>{task.assignee.full_name}</span>
                        </div>
                      )}
                      
                      {task.due_date && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button onClick={() => handleViewTask(task.id)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-gray-500 mt-2">
              {tasks.length > 0 
                ? "Try adjusting your filters to see more results." 
                : "No tasks have been created yet."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskManagement;
