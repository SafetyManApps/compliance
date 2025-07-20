import React from 'react';
import { FileCheck, Upload, UserCheck, AlertCircle } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'document',
      title: 'New REACH declaration uploaded',
      description: 'Product ABC-789 compliance documentation updated',
      time: '30 minutes ago',
      icon: Upload,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 2,
      type: 'approval',
      title: 'Product approved for compliance',
      description: 'Product XYZ-456 passed all compliance checks',
      time: '2 hours ago',
      icon: FileCheck,
      color: 'bg-green-50 text-green-600',
    },
    {
      id: 3,
      type: 'supplier',
      title: 'New supplier onboarded',
      description: 'TechCorp Inc. added to supplier database',
      time: '4 hours ago',
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 4,
      type: 'alert',
      title: 'Compliance violation detected',
      description: 'Product DEF-123 flagged for review',
      time: '1 day ago',
      icon: AlertCircle,
      color: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}