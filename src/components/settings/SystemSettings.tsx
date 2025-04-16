
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface SystemSetting {
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
    const { data, error } = await supabase.from('system_settings').select('*');
    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch system settings', 
        variant: 'destructive' 
      });
    } else {
      setSettings(data || []);
    }
  };

  const updateSetting = async (category: string, key: string, value: string | boolean) => {
    const { error } = await supabase
      .from('system_settings')
      .update({ value: JSON.stringify(value) })
      .eq('category', category)
      .eq('key', key);
    
    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update setting', 
        variant: 'destructive' 
      });
    } else {
      toast({ title: 'Success', description: 'Setting updated successfully' });
      fetchSystemSettings();
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.category) {
      case 'feature_flags':
        return (
          <div className="flex items-center space-x-2">
            <Switch 
              checked={setting.value === 'true'}
              onCheckedChange={(checked) => updateSetting(setting.category, setting.key, checked.toString())}
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
              value={setting.value} 
              onChange={(e) => updateSetting(setting.category, setting.key, e.target.value)}
            />
          </div>
        );
      case 'appearance':
        return (
          <div>
            <label>{setting.key}</label>
            <Input 
              type="color" 
              value={JSON.parse(setting.value as string)} 
              onChange={(e) => updateSetting(setting.category, setting.key, e.target.value)}
            />
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
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Feature Flags</h3>
            {settings.filter(s => s.category === 'feature_flags').map(setting => (
              <div key={setting.key} className="mb-2">
                {renderSettingInput(setting)}
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">System Limits</h3>
            {settings.filter(s => s.category === 'limits').map(setting => (
              <div key={setting.key} className="mb-2">
                {renderSettingInput(setting)}
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Appearance</h3>
            {settings.filter(s => s.category === 'appearance').map(setting => (
              <div key={setting.key} className="mb-2">
                {renderSettingInput(setting)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
