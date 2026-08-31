import React from 'react';
import { Search, Plus, Filter, User } from 'lucide-react';

export default function OfficersPage() {
  const officers = [
    { id: 1, name: 'Alex Johnson', department: 'Traffic & Transport', casesAssigned: 12, casesResolved: 450, rating: 4.8 },
    { id: 2, name: 'Maria Garcia', department: 'Public Works', casesAssigned: 8, casesResolved: 310, rating: 4.5 },
    { id: 3, name: 'Robert Chen', department: 'Water & Sanitation', casesAssigned: 24, casesResolved: 890, rating: 4.9 },
    { id: 4, name: 'Linda Smith', department: 'Parks & Recreation', casesAssigned: 3, casesResolved: 120, rating: 4.2 },
    { id: 5, name: 'James Wilson', department: 'Electrical Board', casesAssigned: 15, casesResolved: 275, rating: 4.6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Officer Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage departmental officers and their assigned jurisdictions.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Assign Officer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search officers..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white w-full sm:w-auto justify-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filter by Department
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Officer Details</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Current Caseload</th>
                <th className="px-6 py-4">Total Resolved</th>
                <th className="px-6 py-4">Citizen Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {officers.map((officer) => (
                <tr key={officer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold border border-blue-100 mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-gray-900">{officer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {officer.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`font-semibold ${officer.casesAssigned > 20 ? 'text-red-600' : 'text-gray-900'}`}>
                        {officer.casesAssigned}
                      </span>
                      <span className="text-gray-500 ml-1">active cases</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {officer.casesResolved}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-1">{officer.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
