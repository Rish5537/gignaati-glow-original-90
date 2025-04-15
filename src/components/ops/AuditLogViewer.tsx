import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuditLog } from "@/services/types/rbac";
import { getAuditLogs } from "@/services/AuditService";

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-800",
  update: "bg-blue-100 text-blue-800",
  delete: "bg-red-100 text-red-800",
  assign: "bg-purple-100 text-purple-800",
  remove: "bg-amber-100 text-amber-800",
  escalate: "bg-orange-100 text-orange-800",
};

const getActionColor = (action: string) => {
  for (const [key, value] of Object.entries(actionColors)) {
    if (action.includes(key)) {
      return value;
    }
  }
  return "bg-gray-100 text-gray-800";
};

const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const { toast } = useToast();

  const resourceTypes = Array.from(new Set(logs.map(log => log.resource_type)));

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, resourceTypeFilter, searchQuery]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getAuditLogs({ limit: 100 });
      setLogs(data);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to load audit logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];
    
    if (resourceTypeFilter !== "all") {
      filtered = filtered.filter(log => log.resource_type === resourceTypeFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(query) ||
        (log.user?.full_name && log.user.full_name.toLowerCase().includes(query))
      );
    }
    
    setFilteredLogs(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatDetails = (details: Record<string, any> | null) => {
    if (!details) return null;
    
    return (
      <pre className="text-xs p-2 bg-gray-50 rounded overflow-x-auto max-h-32">
        {JSON.stringify(details, null, 2)}
      </pre>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <CardTitle>Audit Logs</CardTitle>
        <Button onClick={fetchLogs} variant="outline">
          Refresh Logs
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-1/3"
            />
            
            <Select value={resourceTypeFilter} onValueChange={setResourceTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                {resourceTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-md p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div className="flex items-center space-x-2 mb-2 md:mb-0">
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {log.resource_type}
                    </span>
                    {log.resource_id && (
                      <span className="text-xs text-gray-400">
                        ID: {log.resource_id}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(log.created_at)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {log.user?.full_name?.charAt(0) || "U"}
                  </div>
                  <span className="font-medium">
                    {log.user?.full_name || log.user_id}
                  </span>
                </div>
                
                {log.details && formatDetails(log.details)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No logs found</h3>
            <p className="text-gray-500 mt-2">
              {logs.length > 0 
                ? "Try adjusting your filters to see more results." 
                : "No audit logs have been recorded yet."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
