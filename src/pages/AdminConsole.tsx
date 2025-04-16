import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Activity,
  AlertTriangle,
  BarChart,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  Filter,
  Flag,
  HardDrive,
  Key,
  LayoutDashboard,
  MessageSquare,
  Percent,
  PieChart,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sliders,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Trash,
  TrendingUp,
  User,
  Users,
  Zap,
  UserPlus,
  Check,
  X,
  UserCog
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const AdminConsole = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  // User management
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Gigs moderation
  const [gigs, setGigs] = useState<any[]>([]);
  const [gigSearchTerm, setGigSearchTerm] = useState("");
  const [filteredGigs, setFilteredGigs] = useState<any[]>([]);
  
  // User role management
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  // Gig details dialog
  const [showGigDetailsDialog, setShowGigDetailsDialog] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any>(null);
  const [gigRequirements, setGigRequirements] = useState("");
  
  // Redirect to auth if not admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (user) {
        const isUserAdmin = await checkIfUserIsAdmin(user.id);
        if (!isUserAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin console.",
            variant: "destructive"
          });
          navigate('/');
        }
      } else {
        // Not logged in
        navigate('/auth');
      }
    };
    
    checkAdminAccess();
  }, [user, navigate]);
  
  // Check if user is admin
  const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data } = await supabase.rpc('has_role', { 
        user_id: userId,
        required_role: 'admin'
      });
      
      return !!data;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  };
  
  // Load initial data
  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchGigs();
    }
  }, [user]);
  
  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, created_at');
      
      if (profilesError) throw profilesError;
      
      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Combine data
      const usersWithRoles = profiles.map((profile: any) => {
        const roles = userRoles
          .filter((role: any) => role.user_id === profile.id)
          .map((role: any) => role.role);
        
        return {
          ...profile,
          roles
        };
      });
      
      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  // Search and filter functions
  useEffect(() => {
    if (userSearchTerm) {
      const filtered = users.filter(user => 
        user.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
        user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [userSearchTerm, users]);
  
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
  
  // Handle user role assignment
  const handleOpenRoleDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.roles?.length > 0 ? user.roles[0] : "user");
    setShowRoleDialog(true);
  };
  
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      // First delete existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUser.id);
      
      // Then add the new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role: selectedRole
        });
      
      if (error) throw error;
      
      toast({
        title: "Role assigned",
        description: `${selectedUser.full_name || 'User'} has been assigned the ${selectedRole} role.`
      });
      
      // Refresh user data
      fetchUsers();
      setShowRoleDialog(false);
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role",
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
      fetchUsers();
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
  
  // Handle add new user
  const handleAddUser = () => {
    // Save redirect URL to return after auth
    localStorage.setItem("authRedirectUrl", "/admin");
    // Redirect to auth page
    navigate('/auth');
  };
  
  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase.rpc('delete_user', { user_id: userId });
      
      if (error) throw error;
      
      toast({
        title: "User deleted",
        description: "User has been successfully deleted"
      });
      
      // Refresh users
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8 flex-grow">
        <div className="border-b pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Console</h1>
              <p className="text-gray-500">Manage your platform and users</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-700">All Systems Operational</Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-0">
                <nav className="py-2">
                  <SidebarItem 
                    icon={<LayoutDashboard size={18} />} 
                    label="Dashboard" 
                    active={activeTab === "dashboard"} 
                    onClick={() => setActiveTab("dashboard")} 
                  />
                  <SidebarItem 
                    icon={<Users size={18} />} 
                    label="User Management" 
                    active={activeTab === "users"} 
                    onClick={() => setActiveTab("users")} 
                  />
                  <SidebarItem 
                    icon={<FileText size={18} />} 
                    label="Gigs Moderation" 
                    active={activeTab === "gigs"} 
                    onClick={() => setActiveTab("gigs")} 
                    badge={filteredGigs.length.toString()}
                  />
                  <SidebarItem 
                    icon={<Flag size={18} />} 
                    label="Reported Content" 
                    active={activeTab === "reports"} 
                    onClick={() => setActiveTab("reports")} 
                    badge="5"
                  />
                  <SidebarItem 
                    icon={<Database size={18} />} 
                    label="Database" 
                    active={activeTab === "database"} 
                    onClick={() => setActiveTab("database")} 
                  />
                  <SidebarItem 
                    icon={<Key size={18} />} 
                    label="API Keys" 
                    active={activeTab === "apikeys"} 
                    onClick={() => setActiveTab("apikeys")} 
                  />
                  <SidebarItem 
                    icon={<Sliders size={18} />} 
                    label="Feature Flags" 
                    active={activeTab === "features"} 
                    onClick={() => setActiveTab("features")} 
                  />
                  <SidebarItem 
                    icon={<HardDrive size={18} />} 
                    label="System Health" 
                    active={activeTab === "health"} 
                    onClick={() => setActiveTab("health")} 
                  />
                  <SidebarItem 
                    icon={<Activity size={18} />} 
                    label="Analytics" 
                    active={activeTab === "analytics"} 
                    onClick={() => setActiveTab("analytics")} 
                  />
                  <SidebarItem 
                    icon={<Shield size={18} />} 
                    label="Security" 
                    active={activeTab === "security"} 
                    onClick={() => setActiveTab("security")} 
                  />
                </nav>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">AI Admin Assistant</p>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Run command or query..."
                      className="h-9 text-sm"
                    />
                    <Button size="sm" className="h-9 px-3 bg-black hover:bg-gray-800">
                      <Terminal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="dashboard" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard 
                    title="Total Users" 
                    value={users.length.toString()}
                    change="+12% from last month"
                    trend="up"
                    icon={<Users className="h-5 w-5 text-blue-500" />}
                  />
                  <StatCard 
                    title="Active Gigs" 
                    value={gigs.length.toString()}
                    change="+8% from last month"
                    trend="up"
                    icon={<FileText className="h-5 w-5 text-green-500" />}
                  />
                  <StatCard 
                    title="Revenue" 
                    value="$48,294"
                    change="+23% from last month"
                    trend="up"
                    icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Platform Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-64 flex items-center justify-center">
                        <BarChart className="h-32 w-32 text-gray-300" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Revenue Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-64 flex items-center justify-center">
                        <PieChart className="h-32 w-32 text-gray-300" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Recent Logins</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-full md:w-auto flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Search className="h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Search users..."
                                className="h-8 w-full md:w-60"
                              />
                            </div>
                            <Button variant="outline" size="sm" className="hidden md:flex">
                              <Filter className="h-4 w-4 mr-1" />
                              Filter
                            </Button>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="px-4 py-2">User</th>
                                <th className="px-4 py-2">IP Address</th>
                                <th className="px-4 py-2">Location</th>
                                <th className="px-4 py-2">Time</th>
                                <th className="px-4 py-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {[
                                { name: "David Kim", email: "david@example.com", ip: "192.168.1.1", location: "New York, US", time: "2 min ago", status: "success" },
                                { name: "Sarah Lee", email: "sarah@example.com", ip: "172.16.0.1", location: "London, UK", time: "15 min ago", status: "success" },
                                { name: "Alex Wong", email: "alex@example.com", ip: "10.0.0.1", location: "Toronto, CA", time: "1 hr ago", status: "success" },
                                { name: "Unknown", email: "lisa@example.com", ip: "80.1.1.1", location: "Moscow, RU", time: "3 hrs ago", status: "failed" },
                                { name: "Ahmed Hassan", email: "ahmed@example.com", ip: "192.168.0.54", location: "Cairo, EG", time: "5 hrs ago", status: "success" },
                              ].map((user, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                  <td className="px-4 py-2">
                                    <div>
                                      <div className="font-medium">{user.name}</div>
                                      <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 text-sm">{user.ip}</td>
                                  <td className="px-4 py-2 text-sm">{user.location}</td>
                                  <td className="px-4 py-2 text-sm">{user.time}</td>
                                  <td className="px-4 py-2">
                                    <Badge className={user.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                      {user.status === "success" ? "Success" : "Failed"}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <HealthItem 
                          name="Database" 
                          status="healthy" 
                          metric="28ms" 
                          description="PostgreSQL running normally" 
                        />
                        <HealthItem 
                          name="API Server" 
                          status="healthy" 
                          metric="99.9%" 
                          description="All endpoints responding" 
                        />
                        <HealthItem 
                          name="File Storage" 
                          status="warning" 
                          metric="82%" 
                          description="Storage approaching capacity" 
                        />
                        <HealthItem 
                          name="Auth Service" 
                          status="healthy" 
                          metric="124ms" 
                          description="Authentication working normally" 
                        />
                        <HealthItem 
                          name="Background Jobs" 
                          status="healthy" 
                          metric="0" 
                          description="No failed jobs in queue" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="m-0">
                <Card>
                  <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>User Management</CardTitle>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search users..."
                        className="max-w-xs"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                      <Button 
                        className="bg-black hover:bg-gray-800"
                        onClick={handleAddUser}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              <th className="px-4 py-3">User</th>
                              <th className="px-4 py-3">Role</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Joined</th>
                              <th className="px-4 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                  {userSearchTerm ? "No users matching your search" : "No users found"}
                                </td>
                              </tr>
                            ) : (
                              filteredUsers.map((user, i) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                                        {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : "??"}
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          {user.full_name || 'Unnamed User'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {user.username || 'No username'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge className={
                                      user.roles?.includes('admin') ? "bg-red-100 text-red-800" : 
                                      user.roles?.includes('moderator') ? "bg-blue-100 text-blue-800" : 
                                      user.roles?.includes('creator') ? "bg-green-100 text-green-800" :
                                      user.roles?.includes('employee') ? "bg-purple-100 text-purple-800" :
                                      "bg-gray-100 text-gray-800"
                                    }>
                                      {user.roles?.length > 0 ? user.roles[0] : "User"}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge className="bg-green-100 text-green-800">
                                      Active
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {new Date(user.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleOpenRoleDialog(user)}
                                      >
                                        <UserCog className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <MessageSquare className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        Showing {filteredUsers.length} of {users.length} users
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gigs" className="m-0">
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
              </TabsContent>
              
              <TabsContent value="features" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <FeatureFlagItem 
                        name="New Dashboard UI" 
                        description="Enable the redesigned dashboard interface"
                        enabled={true}
                      />
                      <FeatureFlagItem 
                        name="AI Agent Marketplace" 
                        description="Allow users to buy and sell pre-built AI agents"
                        enabled={true}
                      />
                      <FeatureFlagItem 
                        name="GPT-4 Integration" 
                        description="Enable GPT-4 for premium users"
                        enabled={false}
                      />
                      <FeatureFlagItem 
                        name="Multi-user Collaboration" 
                        description="Enable real-time collaboration features"
                        enabled={false}
                      />
                      <FeatureFlagItem 
                        name="Affiliate Program" 
                        description="Enable user referral and affiliate features"
                        enabled={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Add remaining tab contents as needed */}
              <TabsContent value="apikeys" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>API Key Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">This tab is under development.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="m-0">
