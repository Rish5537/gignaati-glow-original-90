
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface NotificationTemplate {
  id?: string;
  name: string;
  subject: string;
  body: string;
  template_type: string;
  variables: string[];
}

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
    const { data, error } = await supabase.from('notification_templates').select('*');
    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch notification templates', 
        variant: 'destructive' 
      });
    } else {
      setTemplates(data || []);
    }
  };

  const handleSaveTemplate = async () => {
    const { data, error } = await supabase
      .from('notification_templates')
      .upsert(currentTemplate)
      .select();
    
    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save template', 
        variant: 'destructive' 
      });
    } else {
      toast({ title: 'Success', description: 'Template saved successfully' });
      fetchTemplates();
      setCurrentTemplate({
        name: '',
        subject: '',
        body: '',
        template_type: '',
        variables: []
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            placeholder="Template Name" 
            value={currentTemplate.name}
            onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
          />
          <Input 
            placeholder="Subject" 
            value={currentTemplate.subject}
            onChange={(e) => setCurrentTemplate({...currentTemplate, subject: e.target.value})}
          />
          <Textarea 
            placeholder="Body (Use {{variable}} for dynamic content)" 
            value={currentTemplate.body}
            onChange={(e) => setCurrentTemplate({...currentTemplate, body: e.target.value})}
          />
          <Input 
            placeholder="Template Type (email, sms, whatsapp)" 
            value={currentTemplate.template_type}
            onChange={(e) => setCurrentTemplate({...currentTemplate, template_type: e.target.value})}
          />
          <Button onClick={handleSaveTemplate}>Save Template</Button>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Existing Templates</h3>
          {templates.map(template => (
            <div key={template.id} className="border p-2 mb-2">
              <p>{template.name} - {template.template_type}</p>
              <p>{template.subject}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationTemplates;
