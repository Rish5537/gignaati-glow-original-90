
import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export interface SystemSetting {
  id?: string;
  category: string;
  key: string;
  value: string | boolean;
}

interface SettingItemProps {
  setting: SystemSetting;
  onUpdate: (category: string, key: string, value: string | boolean) => void;
}

const SettingItem = ({ setting, onUpdate }: SettingItemProps) => {
  const renderSettingInput = () => {
    switch (setting.category) {
      case 'feature_flags':
        return (
          <div className="flex items-center space-x-2">
            <Switch 
              checked={setting.value === true || setting.value === 'true'}
              onCheckedChange={(checked) => onUpdate(setting.category, setting.key, checked)}
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
              onChange={(e) => onUpdate(setting.category, setting.key, e.target.value)}
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
                onChange={(e) => onUpdate(setting.category, setting.key, e.target.value)}
                className="w-12 h-10"
              />
              <Input 
                type="text" 
                value={setting.value?.toString() || ''} 
                onChange={(e) => onUpdate(setting.category, setting.key, e.target.value)}
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
    <div className="bg-gray-50 p-3 rounded-md">
      {renderSettingInput()}
    </div>
  );
};

export default SettingItem;
