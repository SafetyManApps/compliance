import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TrendChartProps {
  period: string;
}

export function TrendChart({ period }: TrendChartProps) {
  const data = [
    { month: 'Jan', compliance: 85 },
    { month: 'Feb', compliance: 88 },
    { month: 'Mar', compliance: 87 },
    { month: 'Apr', compliance: 91 },
    { month: 'May', compliance: 89 },
    { month: 'Jun', compliance: 93 },
  ];

  const maxCompliance = Math.max(...data.map(d => d.compliance));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Compliance Trends</h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.month} className="flex items-center space-x-3">
            <div className="w-8 text-sm text-gray-600">{item.month}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(item.compliance / maxCompliance) * 100}%` }}
              />
            </div>
            <div className="text-sm font-medium text-gray-900 w-8">{item.compliance}%</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Average Compliance</span>
          <span className="font-medium text-green-600">89%</span>
        </div>
      </div>
    </div>
  );
}