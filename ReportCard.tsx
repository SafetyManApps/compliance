import React from 'react';
import { DivideIcon as LucideIcon, Clock } from 'lucide-react';

interface ReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  lastGenerated: string;
}

export function ReportCard({ title, description, icon: Icon, lastGenerated }: ReportCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          Generate
        </button>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <div className="flex items-center text-xs text-gray-500">
        <Clock className="h-4 w-4 mr-1" />
        Last generated: {lastGenerated}
      </div>
    </div>
  );
}