
import React from "react";
import KRAForm from "./KRAForm";

interface NewKRAFormProps {
  newKRA: {
    name: string;
    description: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSaveNew: () => void;
  onCancelNew: () => void;
}

const NewKRAForm: React.FC<NewKRAFormProps> = ({
  newKRA,
  onInputChange,
  onSaveNew,
  onCancelNew,
}) => {
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <KRAForm
        formData={newKRA}
        onInputChange={onInputChange}
        onSave={onSaveNew}
        onCancel={onCancelNew}
        isNew={true}
      />
    </div>
  );
};

export default NewKRAForm;
