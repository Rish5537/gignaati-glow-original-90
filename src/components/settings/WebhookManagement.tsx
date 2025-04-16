
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
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*');
        
      if (error) {
        toast({ 
          title: 'Error', 
          description: `Failed to fetch webhooks: ${error.message}`, 
          variant: 'destructive' 
        });
      } else {
        setWebhooks(data as Webhook[] || []);
      }
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred while fetching webhooks', 
        variant: 'destructive' 
      });
    }
  };

  const handleSaveWebhook = async () => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .insert(newWebhook)
        .select();
      
      if (error) {
        toast({ 
          title: 'Error', 
          description: `Failed to save webhook: ${error.message}`, 
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
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred', 
        variant: 'destructive' 
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
            <h4 className="mb-3">Select Events</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableEvents.map(event => (
                <div key={event} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                  <Checkbox 
                    checked={newWebhook.events.includes(event)}
                    onCheckedChange={() => toggleEvent(event)}
                    id={`event-${event}`}
                  />
                  <label htmlFor={`event-${event}`} className="text-sm cursor-pointer">{event}</label>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={handleSaveWebhook} className="w-full md:w-auto">Save Webhook</Button>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Existing Webhooks</h3>
          <div className="space-y-3">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="border p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{webhook.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${webhook.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {webhook.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">URL: {webhook.url}</p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Events:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {webhook.events.map(event => (
                      <span key={`${webhook.id}-${event}`} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookManagement;
