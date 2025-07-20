import React from 'react';
import { BarChart3 } from 'lucide-react';

export function ComplianceChart() {
  const data = [
    { category: 'Electronics', compliant: 85, nonCompliant: 15 },
    { category: 'Automotive', compliant: 92, nonCompliant: 8 },
    { category: 'Medical', compliant: 78, nonCompliant: 22 },
    { category: 'Industrial', compliant: 88, nonCompliant: 12 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Compliance by Category</h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{item.category}</span>
              <span className="text-gray-500">{item.compliant}% compliant</span>
            </div>
            <div className="flex bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 rounded-full h-2 transition-all duration-300"
                style={{ width: `${item.compliant}%` }}
              />
              <div 
                className="bg-red-500 rounded-full h-2 transition-all duration-300"
                style={{ width: `${item.nonCompliant}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}