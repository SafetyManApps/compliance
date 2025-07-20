import React, { useState } from 'react';
import { Save } from 'lucide-react';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    complianceAlerts: true,
    documentExpiry: true,
    supplierUpdates: false,
    systemUpdates: true,
    weeklyReports: true,
    monthlyReports: false,
    emailFrequency: 'immediate',
  });

  const handleSave = () => {
    console.log('Notification settings saved:', notifications);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Compliance Alerts</label>
              <p className="text-sm text-gray-500">Get notified when products become non-compliant</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.complianceAlerts}
              onChange={(e) => setNotifications({ ...notifications, complianceAlerts: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Document Expiry</label>
              <p className="text-sm text-gray-500">Alerts when certificates and documents expire</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.documentExpiry}
              onChange={(e) => setNotifications({ ...notifications, documentExpiry: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Supplier Updates</label>
              <p className="text-sm text-gray-500">Notifications about supplier changes</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.supplierUpdates}
              onChange={(e) => setNotifications({ ...notifications, supplierUpdates: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">System Updates</label>
              <p className="text-sm text-gray-500">Updates about system maintenance and features</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.systemUpdates}
              onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Report Notifications</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Weekly Reports</label>
              <p className="text-sm text-gray-500">Weekly compliance summary</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyReports}
              onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Monthly Reports</label>
              <p className="text-sm text-gray-500">Monthly compliance dashboard</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.monthlyReports}
              onChange={(e) => setNotifications({ ...notifications, monthlyReports: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Email Frequency</h4>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="frequency"
              value="immediate"
              checked={notifications.emailFrequency === 'immediate'}
              onChange={(e) => setNotifications({ ...notifications, emailFrequency: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Immediate</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="frequency"
              value="daily"
              checked={notifications.emailFrequency === 'daily'}
              onChange={(e) => setNotifications({ ...notifications, emailFrequency: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Daily Digest</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="frequency"
              value="weekly"
              checked={notifications.emailFrequency === 'weekly'}
              onChange={(e) => setNotifications({ ...notifications, emailFrequency: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Weekly Summary</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}