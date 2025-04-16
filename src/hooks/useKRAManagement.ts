
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { KRA } from "@/services/types/rbac";
import { getAllKRAs, createKRA, updateKRA, deleteKRA } from "@/services/KRAService";

export const useKRAManagement = () => {
  const [KRAs, setKRAs] = useState<KRA[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newKRA, setNewKRA] = useState({ name: '', description: '' });
  const [editKRA, setEditKRA] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchKRAs = async () => {
    setIsLoading(true);
    const data = await getAllKRAs();
    setKRAs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKRAs();
  }, []);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewKRA({ name: '', description: '' });
  };

  const handleNewKRAInputChange = (field: string, value: string) => {
    setNewKRA({ ...newKRA, [field]: value });
  };

  const handleEditKRAInputChange = (field: string, value: string) => {
    setEditKRA({ ...editKRA, [field]: value });
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
      const result = await createKRA(newKRA.name, newKRA.description);
      
      if (result) {
        setKRAs([...KRAs, result]);
        setIsAddingNew(false);
        toast({
          title: "Success",
          description: "KRA added successfully",
        });
      } else {
        throw new Error("Failed to create KRA");
      }
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
      const success = await updateKRA(id, editKRA.name, editKRA.description);

      if (success) {
        setKRAs(KRAs.map(kra => kra.id === id ? { 
          ...kra, 
          name: editKRA.name, 
          description: editKRA.description,
          updated_at: new Date().toISOString()
        } : kra));
        
        setEditingId(null);
        toast({
          title: "Success",
          description: "KRA updated successfully",
        });
      } else {
        throw new Error("Failed to update KRA");
      }
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
      const success = await deleteKRA(id);
      
      if (success) {
        setKRAs(KRAs.filter(kra => kra.id !== id));
        toast({
          title: "Success",
          description: "KRA deleted successfully",
        });
      } else {
        throw new Error("Failed to delete KRA");
      }
    } catch (error) {
      console.error('Error deleting KRA:', error);
      toast({
        title: "Error",
        description: "Failed to delete KRA. It may be assigned to users or tasks.",
        variant: "destructive",
      });
    }
  };

  return {
    KRAs,
    isAddingNew,
    editingId,
    newKRA,
    editKRA,
    isLoading,
    handleAddNew,
    handleNewKRAInputChange,
    handleEditKRAInputChange,
    handleSaveNew,
    handleCancelNew,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete
  };
};
