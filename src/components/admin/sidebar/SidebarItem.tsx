
import React from 'react';
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  badge
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 cursor-pointer",
        active ? "bg-gray-100" : "hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={cn(
          "mr-3",
          active ? "text-black" : "text-gray-500"
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-sm font-medium",
          active ? "text-black" : "text-gray-700"
        )}>
          {label}
        </span>
      </div>
      
      {badge && (
        <div className="bg-gray-200 text-gray-700 text-xs font-medium rounded-full px-2 py-0.5">
          {badge}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
