import React from 'react';
import { StatsCard } from '../components/StatsCard';
import { ComplianceChart } from '../components/ComplianceChart';
import { RecentActivity } from '../components/RecentActivity';
import { AlertsPanel } from '../components/AlertsPanel';
import { Package, FileCheck, AlertTriangle, Users } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value="1,247"
          change="+5.2%"
          changeType="increase"
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Compliant Products"
          value="1,089"
          change="+2.1%"
          changeType="increase"
          icon={FileCheck}
          color="green"
        />
        <StatsCard
          title="Non-Compliant"
          value="158"
          change="-8.3%"
          changeType="decrease"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Active Suppliers"
          value="89"
          change="+3.4%"
          changeType="increase"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceChart />
        <AlertsPanel />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}