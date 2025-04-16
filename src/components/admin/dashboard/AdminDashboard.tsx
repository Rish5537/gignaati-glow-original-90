
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, PieChart, Users, FileText, TrendingUp } from "lucide-react";
import StatCard from "@/components/admin/dashboard/StatCard";
import HealthItem from "@/components/admin/dashboard/HealthItem";

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Users" 
          value="253"
          change="+12% from last month"
          trend="up"
          icon={<Users className="h-5 w-5 text-blue-500" />}
        />
        <StatCard 
          title="Active Gigs" 
          value="124"
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
    </div>
  );
};

export default AdminDashboard;
