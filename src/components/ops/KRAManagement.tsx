
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash, Plus, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KRA } from "@/services/types/rbac";
import { getAllKRAs } from "@/services/OpsService";
import { supabase } from "@/integrations/supabase/client";

const KRAManagement = () => {
  const [KRAs, setKRAs] = useState<KRA[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newKRA, setNewKRA] = useState({ name: '', description: '' });
  const [editKRA, setEditKRA] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchKRAs();
  }, []);

  const fetchKRAs = async () => {
    setIsLoading(true);
    const data = await getAllKRAs();
    setKRAs(data);
    setIsLoading(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewKRA({ name: '', description: '' });
  };

  const handleSaveNew = async () => {
    if (!newKRA.name) {
      toast({
        title: "Error",
        description: "KRA name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('kras')
        .insert({
          name: newKRA.name,
          description: newKRA.description || null
        })
        .select();

      if (error) throw error;

      setKRAs([...KRAs, data[0]]);
      setIsAddingNew(false);
      toast({
        title: "Success",
        description: "KRA added successfully",
      });
    } catch (error) {
      console.error('Error adding KRA:', error);
      toast({
        title: "Error",
        description: "Failed to add KRA",
        variant: "destructive",
      });
    }
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
  };

  const handleEdit = (kra: KRA) => {
    setEditingId(kra.id);
    setEditKRA({ name: kra.name, description: kra.description || '' });
  };

  const handleSaveEdit = async (id: string) => {
    if (!editKRA.name) {
      toast({
        title: "Error",
        description: "KRA name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('kras')
        .update({
          name: editKRA.name,
          description: editKRA.description || null
        })
        .eq('id', id);

      if (error) throw error;

      setKRAs(KRAs.map(kra => kra.id === id ? { ...kra, ...editKRA } : kra));
      setEditingId(null);
      toast({
        title: "Success",
        description: "KRA updated successfully",
      });
    } catch (error) {
      console.error('Error updating KRA:', error);
      toast({
        title: "Error",
        description: "Failed to update KRA",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this KRA?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('kras')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setKRAs(KRAs.filter(kra => kra.id !== id));
      toast({
        title: "Success",
        description: "KRA deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting KRA:', error);
      toast({
        title: "Error",
        description: "Failed to delete KRA. It may be assigned to users or tasks.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Key Responsibility Areas (KRAs)</CardTitle>
        <Button onClick={handleAddNew} disabled={isAddingNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add KRA
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {isAddingNew && (
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input 
                      value={newKRA.name} 
                      onChange={e => setNewKRA({...newKRA, name: e.target.value})}
                      placeholder="Enter KRA name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea 
                      value={newKRA.description} 
                      onChange={e => setNewKRA({...newKRA, description: e.target.value})}
                      placeholder="Enter KRA description"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelNew}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveNew}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {KRAs.length === 0 && !isAddingNew ? (
              <div className="text-center py-6 text-gray-500">
                No KRAs found. Click "Add KRA" to create one.
              </div>
            ) : (
              KRAs.map(kra => (
                <div key={kra.id} className="border rounded-md p-4">
                  {editingId === kra.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name</label>
                        <Input 
                          value={editKRA.name} 
                          onChange={e => setEditKRA({...editKRA, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Textarea 
                          value={editKRA.description} 
                          onChange={e => setEditKRA({...editKRA, description: e.target.value})}
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button onClick={() => handleSaveEdit(kra.id)}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{kra.name}</h3>
                          {kra.description && <p className="text-gray-500 mt-1">{kra.description}</p>}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(kra)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(kra.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KRAManagement;
