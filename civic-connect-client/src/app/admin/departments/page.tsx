import React from 'react';
import { Building2, Plus, Users, CheckCircle, Clock } from 'lucide-react';

export default function DepartmentsPage() {
  const departments = [
    { 
      id: 1, 
      name: 'Public Works', 
      head: 'Michael Chen', 
      officersCount: 24, 
      activeTickets: 145, 
      resolutionRate: '88%',
      status: 'Healthy'
    },
    { 
      id: 2, 
      name: 'Water & Sanitation', 
      head: 'Sarah Jenkins', 
      officersCount: 18, 
      activeTickets: 312, 
      resolutionRate: '76%',
      status: 'Warning'
    },
    { 
      id: 3, 
      name: 'Traffic & Transport', 
      head: 'David Rodriguez', 
      officersCount: 32, 
      activeTickets: 89, 
      resolutionRate: '94%',
      status: 'Healthy'
    },
    { 
      id: 4, 
      name: 'Parks & Recreation', 
      head: 'Emily Watson', 
      officersCount: 12, 
      activeTickets: 45, 
      resolutionRate: '98%',
      status: 'Healthy'
    },
    { 
      id: 5, 
      name: 'Electrical Board', 
      head: 'James Wilson', 
      officersCount: 28, 
      activeTickets: 254, 
      resolutionRate: '82%',
      status: 'Monitor'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Department Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure municipal departments and monitor their performance.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 mr-3">
                  <Building2 className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                  <p className="text-xs text-gray-500">Head: {dept.head}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                dept.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                dept.status === 'Warning' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {dept.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" /> Officers
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{dept.officersCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" /> Active Tickets
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{dept.activeTickets}</p>
              </div>
              <div className="col-span-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Resolution Rate
                  </span>
                  <span className="font-medium text-gray-900">{dept.resolutionRate}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${parseInt(dept.resolutionRate) < 80 ? 'bg-red-500' : parseInt(dept.resolutionRate) < 90 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: dept.resolutionRate }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 pt-4 flex space-x-2">
              <button className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
                View Details
              </button>
              <button className="flex-1 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded transition-colors">
                Edit Rules
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
