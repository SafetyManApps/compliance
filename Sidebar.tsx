import React from 'react';
import { 
  BarChart3, 
  Package, 
  Component,
  FileText, 
  Users, 
  TrendingUp, 
  Settings, 
  X,
  Shield
} from 'lucide-react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: BarChart3, page: 'dashboard' as Page },
  { name: 'Products', icon: Package, page: 'products' as Page },
  { name: 'Documents', icon: FileText, page: 'documents' as Page },
  { name: 'Suppliers', icon: Users, page: 'suppliers' as Page },
  { name: 'Supplier Parts', icon: Component, page: 'supplier-parts' as Page },
  { name: 'Reports', icon: TrendingUp, page: 'reports' as Page },
  { name: 'Settings', icon: Settings, page: 'settings' as Page },
];

export function Sidebar({ currentPage, onPageChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ComplianceTracker</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              
              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      onPageChange(item.page);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}