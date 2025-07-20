import React, { useState } from 'react';
import { Save, Plus, Edit2, Trash2, Shield } from 'lucide-react';

export function UserSettings() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@acme.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@acme.com', role: 'manager', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@acme.com', role: 'user', status: 'inactive' },
  ]);

  const [permissions, setPermissions] = useState({
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: false,
    canViewReports: true,
    canManageUsers: false,
  });

  const handleSave = () => {
    console.log('User settings saved:', { users, permissions });
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[role as keyof typeof styles]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>
      
      <div className="pt-6 border-t">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Default Permissions
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Create Products</label>
              <p className="text-sm text-gray-500">Allow users to create new products</p>
            </div>
            <input
              type="checkbox"
              checked={permissions.canCreateProducts}
              onChange={(e) => setPermissions({ ...permissions, canCreateProducts: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Edit Products</label>
              <p className="text-sm text-gray-500">Allow users to modify existing products</p>
            </div>
            <input
              type="checkbox"
              checked={permissions.canEditProducts}
              onChange={(e) => setPermissions({ ...permissions, canEditProducts: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Delete Products</label>
              <p className="text-sm text-gray-500">Allow users to delete products</p>
            </div>
            <input
              type="checkbox"
              checked={permissions.canDeleteProducts}
              onChange={(e) => setPermissions({ ...permissions, canDeleteProducts: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">View Reports</label>
              <p className="text-sm text-gray-500">Allow users to access compliance reports</p>
            </div>
            <input
              type="checkbox"
              checked={permissions.canViewReports}
              onChange={(e) => setPermissions({ ...permissions, canViewReports: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Manage Users</label>
              <p className="text-sm text-gray-500">Allow users to manage other users</p>
            </div>
            <input
              type="checkbox"
              checked={permissions.canManageUsers}
              onChange={(e) => setPermissions({ ...permissions, canManageUsers: e.target.checked })}
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