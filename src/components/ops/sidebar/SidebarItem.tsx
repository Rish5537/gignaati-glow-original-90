
import React from 'react';

interface SidebarItemProps { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void; 
  badge?: string; 
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
  badge
}) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100 ${
        active ? "bg-gray-100 font-medium" : "text-gray-700"
      }`}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 text-xs font-medium text-white bg-red-500 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

export default SidebarItem;
