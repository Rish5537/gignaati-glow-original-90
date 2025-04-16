
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface SystemSetting {
  id?: string;
  category: string;
  key: string;
  value: string | boolean;
}

const SystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');
        
      if (error) {
        toast({ 
          title: 'Error', 
          description: `Failed to fetch system settings: ${error.message}`, 
          variant: 'destructive' 
        });
      } else {
        // Transform the data to match our interface
        const transformedSettings = data.map(setting => {
          try {
            return {
              ...setting,
              value: JSON.parse(setting.value as string)
            };
          } catch (e) {
            return setting;
          }
        });
        setSettings(transformedSettings as SystemSetting[]);
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred while fetching settings', 
        variant: 'destructive' 
      });
    }
  };

  const updateSetting = async (category: string, key: string, value: string | boolean) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ value: JSON.stringify(value) })
        .eq('category', category)
        .eq('key', key);
      
      if (error) {
        toast({ 
          title: 'Error', 
          description: `Failed to update setting: ${error.message}`, 
          variant: 'destructive' 
        });
      } else {
        toast({ title: 'Success', description: 'Setting updated successfully' });
        fetchSystemSettings();
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred', 
        variant: 'destructive' 
      });
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.category) {
      case 'feature_flags':
        return (
          <div className="flex items-center space-x-2">
            <Switch 
              checked={setting.value === true || setting.value === 'true'}
              onCheckedChange={(checked) => updateSetting(setting.category, setting.key, checked)}
            />
            <span>{setting.key.replace(/_/g, ' ')}</span>
          </div>
        );
      case 'limits':
        return (
          <div>
            <label>{setting.key.replace(/_/g, ' ')}</label>
            <Input 
              type="number" 
              value={setting.value?.toString() || ''} 
              onChange={(e) => updateSetting(setting.category, setting.key, e.target.value)}
              className="mt-1"
            />
          </div>
        );
      case 'appearance':
        return (
          <div>
            <label>{setting.key}</label>
            <div className="flex items-center mt-1">
              <Input 
                type="color" 
                value={setting.value?.toString() || '#000000'} 
                onChange={(e) => updateSetting(setting.category, setting.key, e.target.value)}
                className="w-12 h-10"
              />
              <Input 
                type="text" 
                value={setting.value?.toString() || ''} 
                onChange={(e) => updateSetting(setting.category, setting.key, e.target.value)}
                className="ml-2"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Feature Flags</h3>
            <div className="space-y-3">
              {settings
                .filter(s => s.category === 'feature_flags')
                .map(setting => (
                  <div key={`${setting.category}-${setting.key}`} className="bg-gray-50 p-3 rounded-md">
                    {renderSettingInput(setting)}
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">System Limits</h3>
            <div className="space-y-4">
              {settings
                .filter(s => s.category === 'limits')
                .map(setting => (
                  <div key={`${setting.category}-${setting.key}`} className="bg-gray-50 p-3 rounded-md">
                    {renderSettingInput(setting)}
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Appearance</h3>
            <div className="space-y-4">
              {settings
                .filter(s => s.category === 'appearance')
                .map(setting => (
                  <div key={`${setting.category}-${setting.key}`} className="bg-gray-50 p-3 rounded-md">
                    {renderSettingInput(setting)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
