
import React from 'react';
import StatCard from './StatCard';

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Tasks Assigned" 
        value="14"
        category="Operations"
      />
      <StatCard 
        title="Tasks Completed" 
        value="23"
        category="This Month"
      />
      <StatCard 
        title="Pending Approvals" 
        value="7"
        category="Creator Verifications"
      />
    </div>
  );
};

export default DashboardStats;
