import React from 'react';
import { AlertTriangle, Clock, FileX } from 'lucide-react';

export function AlertsPanel() {
  const alerts = [
    {
      id: 1,
      type: 'error',
      title: 'Non-compliant Product Detected',
      message: 'Product XYZ-123 contains restricted substances',
      time: '2 hours ago',
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Certificate Expiring Soon',
      message: 'RoHS certificate for Supplier ABC expires in 7 days',
      time: '1 day ago',
      icon: Clock,
    },
    {
      id: 3,
      type: 'error',
      title: 'Missing Documentation',
      message: 'REACH declaration missing for Product DEF-456',
      time: '2 days ago',
      icon: FileX,
    },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Alerts</h3>
      
      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${getAlertColor(alert.type)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all alerts
      </button>
    </div>
  );
}