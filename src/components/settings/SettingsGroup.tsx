
import React from 'react';
import SettingItem, { SystemSetting } from './SettingItem';

interface SettingsGroupProps {
  title: string;
  category: string;
  settings: SystemSetting[];
  onUpdateSetting: (category: string, key: string, value: string | boolean) => void;
}

const SettingsGroup = ({ title, category, settings, onUpdateSetting }: SettingsGroupProps) => {
  const filteredSettings = settings.filter(s => s.category === category);
  
  if (filteredSettings.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-3">
        {filteredSettings.map(setting => (
          <SettingItem
            key={`${setting.category}-${setting.key}`}
            setting={setting}
            onUpdate={onUpdateSetting}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsGroup;
