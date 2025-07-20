import React, { useState } from 'react';
import { SettingsSection } from '../components/SettingsSection';
import { NotificationSettings } from '../components/NotificationSettings';
import { ComplianceSettings } from '../components/ComplianceSettings';
import { UserSettings } from '../components/UserSettings';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'compliance', label: 'Compliance Rules' },
    { id: 'users', label: 'Users & Permissions' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <SettingsSection />;
      case 'notifications':
        return <NotificationSettings />;
      case 'compliance':
        return <ComplianceSettings />;
      case 'users':
        return <UserSettings />;
      default:
        return <SettingsSection />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderContent()}
      </div>
    </div>
  );
}