
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import NotificationTemplateForm, { NotificationTemplate } from './notification-templates/NotificationTemplateForm';
import NotificationTemplateList from './notification-templates/NotificationTemplateList';
import { extractVariablesFromTemplate } from './notification-templates/notificationTemplateUtils';

const NotificationTemplates = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<NotificationTemplate>({
    name: '',
    subject: '',
    body: '',
    template_type: '',
    variables: []
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*');
        
      if (error) {
        toast({ 
          title: 'Error', 
          description: `Failed to fetch notification templates: ${error.message}`, 
          variant: 'destructive' 
        });
      } else {
        setTemplates(data as NotificationTemplate[] || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred while fetching templates', 
        variant: 'destructive' 
      });
    }
  };

  const handleSelectTemplate = (template: NotificationTemplate) => {
    setCurrentTemplate(template);
  };

  const handleTemplateChange = (template: NotificationTemplate) => {
    // Extract variables when body changes
    const updatedTemplate = { 
      ...template,
      variables: extractVariablesFromTemplate(template.body)
    };
    setCurrentTemplate(updatedTemplate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationTemplateForm 
          template={currentTemplate} 
          setTemplate={handleTemplateChange}
          onSave={fetchTemplates}
        />
        <NotificationTemplateList 
          templates={templates} 
          onSelectTemplate={handleSelectTemplate}
        />
      </CardContent>
    </Card>
  );
};

export default NotificationTemplates;
