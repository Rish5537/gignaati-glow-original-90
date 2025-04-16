
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id?: string;
  name: string;
  key_value: string;
  service: string;
  environment: string;
  is_active: boolean;
}

const APIKeyManagement = () => {
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);
  const [newAPIKey, setNewAPIKey] = useState<APIKey>({
    name: '',
    key_value: '',
    service: '',
    environment: 'sandbox',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    const { data, error } = await supabase.from('api_keys').select('*');
    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch API keys', 
        variant: 'destructive' 
      });
    } else {
      setAPIKeys(data || []);
    }
  };

  const handleSaveAPIKey = async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .insert(newAPIKey)
      .select();
    
    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save API key', 
        variant: 'destructive' 
      });
    } else {
      toast({ title: 'Success', description: 'API Key saved successfully' });
      fetchAPIKeys();
      setNewAPIKey({
        name: '',
        key_value: '',
        service: '',
        environment: 'sandbox',
        is_active: true
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            placeholder="API Key Name" 
            value={newAPIKey.name}
            onChange={(e) => setNewAPIKey({...newAPIKey, name: e.target.value})}
          />
          <Input 
            placeholder="API Key Value" 
            type="password"
            value={newAPIKey.key_value}
            onChange={(e) => setNewAPIKey({...newAPIKey, key_value: e.target.value})}
          />
          <Input 
            placeholder="Service (e.g., Stripe, SendGrid)" 
            value={newAPIKey.service}
            onChange={(e) => setNewAPIKey({...newAPIKey, service: e.target.value})}
          />
          <Select 
            value={newAPIKey.environment}
            onValueChange={(value) => setNewAPIKey({...newAPIKey, environment: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sandbox">Sandbox</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSaveAPIKey}>Save API Key</Button>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Existing API Keys</h3>
          {apiKeys.map(key => (
            <div key={key.id} className="border p-2 mb-2">
              <p>{key.name} - {key.service}</p>
              <p>Environment: {key.environment}</p>
              <p>Status: {key.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyManagement;
