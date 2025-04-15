
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";

interface KRAFormProps {
  formData: {
    name: string;
    description: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}

const KRAForm: React.FC<KRAFormProps> = ({
  formData,
  onInputChange,
  onSave,
  onCancel,
  isNew = false,
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-1 block">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          placeholder="Enter KRA name"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Enter KRA description"
          rows={2}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default KRAForm;
