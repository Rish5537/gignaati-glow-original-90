
import React from "react";
import { KRA } from "@/services/types/rbac";
import KRAListItem from "./KRAListItem";

interface KRAListProps {
  kras: KRA[];
  editingId: string | null;
  editKRA: { name: string; description: string };
  onEdit: (kra: KRA) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onInputChange: (field: string, value: string) => void;
}

const KRAList: React.FC<KRAListProps> = ({
  kras,
  editingId,
  editKRA,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  onInputChange,
}) => {
  if (kras.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No KRAs found. Click "Add KRA" to create one.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {kras.map((kra) => (
        <KRAListItem
          key={kra.id}
          kra={kra}
          editingId={editingId}
          editKRA={editKRA}
          onEdit={onEdit}
          onDelete={onDelete}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onInputChange={onInputChange}
        />
      ))}
    </div>
  );
};

export default KRAList;
