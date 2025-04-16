
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminConsole = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
                    badge="12"
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
                    value="4,287"
                    change="+12% from last month"
                    trend="up"
                    icon={<Users className="h-5 w-5 text-blue-500" />}
                  />
                  <StatCard 
                    title="Active Gigs" 
                    value="1,432"
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
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                      <Button className="bg-black hover:bg-gray-800">
                        <User className="h-4 w-4 mr-1" />
                        Add User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
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
                          {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                                    {["JD", "SW", "RK", "AM", "TL"][i]}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {["John Doe", "Sarah Wilson", "Robert Kim", "Alice Miller", "Tom Lee"][i]}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {[
                                        "john@example.com", 
                                        "sarah@example.com", 
                                        "robert@example.com", 
                                        "alice@example.com", 
                                        "tom@example.com"
                                      ][i]}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={
                                  i === 0 ? "bg-red-100 text-red-800" : 
                                  i === 1 ? "bg-blue-100 text-blue-800" : 
                                  "bg-gray-100 text-gray-800"
                                }>
                                  {i === 0 ? "Admin" : i === 1 ? "Moderator" : "User"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={
                                  i === 3 ? "bg-yellow-100 text-yellow-800" : 
                                  "bg-green-100 text-green-800"
                                }>
                                  {i === 3 ? "Pending" : "Active"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {[
                                  "Jan 10, 2023", 
                                  "Mar 5, 2023", 
                                  "Apr 22, 2023", 
                                  "May 15, 2023", 
                                  "June 3, 2023"
                                ][i]}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Sliders className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        Showing 1-5 of 103 users
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
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: "AI Chatbot Developer", type: "New", creator: "John Smith", date: "Today at 10:23 AM" },
                        { title: "Custom GPT Model Training", type: "Updated", creator: "Sarah Lee", date: "Today at 09:15 AM" },
                        { title: "Data Scraping Automation", type: "Reported", creator: "Mike Johnson", date: "Yesterday at 4:30 PM" },
                        { title: "AI-Powered Email Campaigns", type: "New", creator: "Alice Williams", date: "Yesterday at 2:45 PM" },
                        { title: "Neural Network Design", type: "New", creator: "David Chen", date: "Yesterday at 11:20 AM" },
                      ].map((gig, i) => (
                        <ModerateGigItem 
                          key={i}
                          title={gig.title}
                          type={gig.type as "New" | "Updated" | "Reported"}
                          creator={gig.creator}
                          date={gig.date}
                        />
                      ))}
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
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">This tab is under development.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              Admin Console v1.2.0 | Last updated: April 14, 2025
            </p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <Link to="/admin/help" className="text-sm text-gray-500 hover:text-gray-800">Help</Link>
              <Link to="/admin/security" className="text-sm text-gray-500 hover:text-gray-800">Security</Link>
              <Link to="/admin/changelog" className="text-sm text-gray-500 hover:text-gray-800">Changelog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  badge 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void; 
  badge?: string; 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100 ${
        active ? "bg-gray-100 font-medium" : "text-gray-700"
      }`}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 text-xs font-medium text-white bg-red-500 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

const StatCard = ({ 
  title, 
  value, 
  change,
  trend,
  icon 
}: { 
  title: string; 
  value: string; 
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode; 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gray-100 p-2 rounded-md">
            {icon}
          </div>
          <div className={`flex items-center text-xs font-medium ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}>
            <span>{change}</span>
            {trend === "up" ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const HealthItem = ({ 
  name, 
  status, 
  metric, 
  description 
}: { 
  name: string; 
  status: "healthy" | "warning" | "critical"; 
  metric: string; 
  description: string; 
}) => {
  const statusColors = {
    healthy: "text-green-500",
    warning: "text-amber-500",
    critical: "text-red-500"
  };
  
  const statusIcons = {
    healthy: <ShieldCheck className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    critical: <AlertTriangle className="h-5 w-5 text-red-500" />
  };
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
      <div className="flex items-center">
        <div className="mr-3">
          {statusIcons[status]}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-right">
          <p className={`font-medium ${statusColors[status]}`}>
            {status === "healthy" ? "Healthy" : 
             status === "warning" ? "Warning" : 
             "Critical"}
          </p>
          <p className="text-sm text-gray-500">{metric}</p>
        </div>
        <Button variant="ghost" size="sm" className="ml-2">
          <Zap className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface ModerateGigProps {
  title: string;
  type: "New" | "Updated" | "Reported";
  creator: string;
  date: string;
}

const ModerateGigItem = ({ 
  title, 
  type, 
  creator, 
  date 
}: ModerateGigProps) => {
  const badgeColors = {
    New: "bg-blue-100 text-blue-800",
    Updated: "bg-amber-100 text-amber-800",
    Reported: "bg-red-100 text-red-800"
  };
  
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <Badge className={badgeColors[type]}>
              {type}
            </Badge>
            <span className="text-sm text-gray-500 ml-2">{date}</span>
          </div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">Created by {creator}</p>
        </div>
        
        <div className="flex mt-3 sm:mt-0">
          <Button variant="outline" className="mr-2" size="sm">
            View Details
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 mr-2" size="sm">
            <ThumbsUp className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button variant="destructive" size="sm">
            <ThumbsDown className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

interface FeatureFlagProps {
  name: string;
  description: string;
  enabled: boolean;
}

const FeatureFlagItem = ({ 
  name, 
  description, 
  enabled 
}: FeatureFlagProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center space-x-8">
        <div className="text-sm text-gray-500">
          {isEnabled ? (
            <Badge className="bg-green-100 text-green-800">
              Enabled
            </Badge>
          ) : (
            <Badge variant="outline">
              Disabled
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            id={`feature-${name.toLowerCase().replace(/\s+/g, '-')}`}
          />
          <Label 
            htmlFor={`feature-${name.toLowerCase().replace(/\s+/g, '-')}`}
            className="sr-only"
          >
            Toggle {name}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
