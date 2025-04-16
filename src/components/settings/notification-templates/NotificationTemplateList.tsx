
import React from 'react';

export interface NotificationTemplate {
  id?: string;
  name: string;
  subject: string;
  body: string;
  template_type: string;
  variables: string[];
}

interface NotificationTemplateListProps {
  templates: NotificationTemplate[];
  onSelectTemplate?: (template: NotificationTemplate) => void;
}

const NotificationTemplateList = ({ templates, onSelectTemplate }: NotificationTemplateListProps) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Existing Templates</h3>
      <div className="space-y-2">
        {templates.map(template => (
          <div 
            key={template.id} 
            className="border p-3 rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectTemplate && onSelectTemplate(template)}
          >
            <div className="flex justify-between">
              <h4 className="font-medium">{template.name}</h4>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {template.template_type}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{template.subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationTemplateList;
