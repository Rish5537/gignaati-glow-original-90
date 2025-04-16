
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
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*');
        
      if (error) {
        toast({ 
          title: 'Error', 
          description: `Failed to fetch API keys: ${error.message}`, 
          variant: 'destructive' 
        });
      } else {
        setAPIKeys(data as APIKey[] || []);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred while fetching API keys', 
        variant: 'destructive' 
      });
    }
  };

  const handleSaveAPIKey = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert(newAPIKey)
        .select();
      
      if (error) {
        toast({ 
          title: 'Error', 
          description: `Failed to save API key: ${error.message}`, 
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
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred', 
        variant: 'destructive' 
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
          <div className="space-y-2">
            {apiKeys.map(key => (
              <div key={key.id} className="border p-3 rounded-md">
                <div className="flex justify-between">
                  <h4 className="font-medium">{key.name}</h4>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {key.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {key.environment}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{key.service}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyManagement;
