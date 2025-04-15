
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { KRA } from "@/services/types/rbac";
import KRAForm from "./KRAForm";

interface KRAListItemProps {
  kra: KRA;
  editingId: string | null;
  editKRA: { name: string; description: string };
  onEdit: (kra: KRA) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onInputChange: (field: string, value: string) => void;
}

const KRAListItem: React.FC<KRAListItemProps> = ({
  kra,
  editingId,
  editKRA,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  onInputChange,
}) => {
  return (
    <div className="border rounded-md p-4">
      {editingId === kra.id ? (
        <KRAForm
          formData={editKRA}
          onInputChange={onInputChange}
          onSave={() => onSaveEdit(kra.id)}
          onCancel={onCancelEdit}
        />
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{kra.name}</h3>
            {kra.description && <p className="text-gray-500 mt-1">{kra.description}</p>}
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(kra)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => onDelete(kra.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KRAListItem;
