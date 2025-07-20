import React, { useState } from 'react';
import { Save, Plus, Edit2, Trash2 } from 'lucide-react';

export function ComplianceSettings() {
  const [rules, setRules] = useState([
    { id: 1, name: 'REACH Compliance', description: 'EU chemical safety regulation', enabled: true },
    { id: 2, name: 'RoHS Directive', description: 'Hazardous substances restriction', enabled: true },
    { id: 3, name: 'PFAS Regulation', description: 'Per- and polyfluoroalkyl substances restriction', enabled: true },
    { id: 4, name: 'WEEE Directive', description: 'Waste electrical equipment', enabled: false },
  ]);

  const [settings, setSettings] = useState({
    defaultExpiryDays: 365,
    autoApproval: false,
    strictMode: true,
    requireDocumentation: true,
  });

  const handleSave = () => {
    console.log('Compliance settings saved:', { rules, settings });
  };

  const toggleRule = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Rules</h3>
        
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => toggleRule(rule.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{rule.name}</h4>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-700">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add New Rule</span>
        </button>
      </div>
      
      <div className="pt-6 border-t">
        <h4 className="text-md font-semibold text-gray-900 mb-4">General Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Certificate Expiry (days)
            </label>
            <input
              type="number"
              value={settings.defaultExpiryDays}
              onChange={(e) => setSettings({ ...settings, defaultExpiryDays: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto Approval</label>
              <p className="text-sm text-gray-500">Automatically approve compliant products</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoApproval}
              onChange={(e) => setSettings({ ...settings, autoApproval: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Strict Mode</label>
              <p className="text-sm text-gray-500">Require all compliance checks to pass</p>
            </div>
            <input
              type="checkbox"
              checked={settings.strictMode}
              onChange={(e) => setSettings({ ...settings, strictMode: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Require Documentation</label>
              <p className="text-sm text-gray-500">Mandate documentation for all products</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireDocumentation}
              onChange={(e) => setSettings({ ...settings, requireDocumentation: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
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