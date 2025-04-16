
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useKRAManagement } from "@/hooks/useKRAManagement";
import NewKRAForm from "./kra/NewKRAForm";
import KRAList from "./kra/KRAList";

const KRAManagement = () => {
  const {
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
  } = useKRAManagement();

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
              <NewKRAForm
                newKRA={newKRA}
                onInputChange={handleNewKRAInputChange}
                onSaveNew={handleSaveNew}
                onCancelNew={handleCancelNew}
              />
            )}
            
            <KRAList
              kras={KRAs}
              editingId={editingId}
              editKRA={editKRA}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              onInputChange={handleEditKRAInputChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KRAManagement;
