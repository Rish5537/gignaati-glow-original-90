
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface Webhook {
  id?: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret_key?: string;
}

const WebhookManagement = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhook, setNewWebhook] = useState<Webhook>({
    name: '',
    url: '',
    events: [],
    is_active: true
  });
  const { toast } = useToast();

  const availableEvents = [
    'user.signup', 
    'order.created', 
    'gig.published', 
    'payment.completed', 
    'dispute.raised'
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    const { data, error } = await supabase.from('webhooks').select('*');
    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch webhooks', 
        variant: 'destructive' 
      });
    } else {
      setWebhooks(data || []);
    }
  };

  const handleSaveWebhook = async () => {
    const { data, error } = await supabase
      .from('webhooks')
      .insert(newWebhook)
      .select();
    
    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save webhook', 
        variant: 'destructive' 
      });
    } else {
      toast({ title: 'Success', description: 'Webhook saved successfully' });
      fetchWebhooks();
      setNewWebhook({
        name: '',
        url: '',
        events: [],
        is_active: true
      });
    }
  };

  const toggleEvent = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            placeholder="Webhook Name" 
            value={newWebhook.name}
            onChange={(e) => setNewWebhook({...newWebhook, name: e.target.value})}
          />
          <Input 
            placeholder="Webhook URL" 
            value={newWebhook.url}
            onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
          />
          <Input 
            placeholder="Secret Key (optional)" 
            type="password"
            value={newWebhook.secret_key || ''}
            onChange={(e) => setNewWebhook({...newWebhook, secret_key: e.target.value})}
          />
          
          <div>
            <h4 className="mb-2">Select Events</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableEvents.map(event => (
                <div key={event} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={newWebhook.events.includes(event)}
                    onCheckedChange={() => toggleEvent(event)}
                  />
                  <span>{event}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={handleSaveWebhook}>Save Webhook</Button>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Existing Webhooks</h3>
          {webhooks.map(webhook => (
            <div key={webhook.id} className="border p-2 mb-2">
              <p>{webhook.name}</p>
              <p>URL: {webhook.url}</p>
              <p>Events: {webhook.events.join(', ')}</p>
              <p>Status: {webhook.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookManagement;
