
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SettingsGroup from './SettingsGroup';
import { SystemSetting } from './SettingItem';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <SettingsGroup 
            title="Feature Flags"
            category="feature_flags"
            settings={settings}
            onUpdateSetting={updateSetting}
          />
          
          <SettingsGroup 
            title="System Limits"
            category="limits"
            settings={settings}
            onUpdateSetting={updateSetting}
          />
          
          <SettingsGroup 
            title="Appearance"
            category="appearance"
            settings={settings}
            onUpdateSetting={updateSetting}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
