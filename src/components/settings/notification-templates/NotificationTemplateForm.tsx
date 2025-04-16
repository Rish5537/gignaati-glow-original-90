
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface NotificationTemplate {
  id?: string;
  name: string;
  subject: string;
  body: string;
  template_type: string;
  variables: string[];
}

interface NotificationTemplateFormProps {
  template: NotificationTemplate;
  setTemplate: (template: NotificationTemplate) => void;
  onSave: () => void;
}

const NotificationTemplateForm = ({ template, setTemplate, onSave }: NotificationTemplateFormProps) => {
  const { toast } = useToast();

  const handleSaveTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .upsert({
          ...template,
          variables: template.variables
        })
        .select();
      
      if (error) {
        toast({ 
          title: 'Error', 
          description: `Failed to save template: ${error.message}`, 
          variant: 'destructive' 
        });
      } else {
        toast({ title: 'Success', description: 'Template saved successfully' });
        onSave();
        setTemplate({
          name: '',
          subject: '',
          body: '',
          template_type: '',
          variables: []
        });
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Template Name" 
        value={template.name}
        onChange={(e) => setTemplate({...template, name: e.target.value})}
      />
      <Input 
        placeholder="Subject" 
        value={template.subject}
        onChange={(e) => setTemplate({...template, subject: e.target.value})}
      />
      <Textarea 
        placeholder="Body (Use {{variable}} for dynamic content)" 
        value={template.body}
        onChange={(e) => setTemplate({...template, body: e.target.value})}
      />
      <Input 
        placeholder="Template Type (email, sms, whatsapp)" 
        value={template.template_type}
        onChange={(e) => setTemplate({...template, template_type: e.target.value})}
      />
      <Button onClick={handleSaveTemplate}>Save Template</Button>
    </div>
  );
};

export default NotificationTemplateForm;
