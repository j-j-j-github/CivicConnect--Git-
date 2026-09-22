import React from 'react';
import { Search, Plus, MoreHorizontal, Filter } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 1, name: 'Arjun Ghosh', email: 'arjun@civicconnect.gov', role: 'Administrator', status: 'Active', lastLogin: '10 mins ago' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@civicconnect.gov', role: 'Officer', status: 'Active', lastLogin: '1 hour ago' },
    { id: 3, name: 'John Smith', email: 'jsmith@example.com', role: 'Citizen', status: 'Inactive', lastLogin: '5 days ago' },
    { id: 4, name: 'Sarah Connor', email: 's.connor@civicconnect.gov', role: 'Officer', status: 'Active', lastLogin: '2 hours ago' },
    { id: 5, name: 'Robert Baratheon', email: 'robert@example.com', role: 'Citizen', status: 'Active', lastLogin: '10 mins ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system users, assign roles, and control access.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white w-full sm:w-auto justify-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filter by Role
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold border border-slate-200">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.role === 'Administrator' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                      user.role === 'Officer' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <span className="text-gray-700">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <span>Showing 1 to 5 of 5 entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-blue-50 text-blue-600 font-medium">1</button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
