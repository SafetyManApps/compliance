import React from 'react';
import { PieChart } from 'lucide-react';

export function ComplianceOverview() {
  const data = [
    { label: 'Compliant', value: 87, color: 'bg-green-500' },
    { label: 'Non-Compliant', value: 8, color: 'bg-red-500' },
    { label: 'Pending', value: 5, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Compliance Overview</h3>
        <PieChart className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Products</span>
          <span className="font-medium text-gray-900">1,247</span>
        </div>
      </div>
    </div>
  );
}