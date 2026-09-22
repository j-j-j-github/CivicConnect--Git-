import React from 'react';
import { AlertCircle, Clock, ShieldAlert, ArrowUpRight, Search, Filter } from 'lucide-react';

export default function SLAPage() {
  const overdueTickets = [
    { id: 'TKT-8942', category: 'Water Leak', department: 'Water & Sanitation', priority: 'P1', due: '2 hours ago', status: 'Escalated to Head' },
    { id: 'TKT-8910', category: 'Pothole', department: 'Public Works', priority: 'P2', due: '1 day ago', status: 'Pending Review' },
    { id: 'TKT-8845', category: 'Traffic Light Out', department: 'Traffic & Transport', priority: 'P1', due: '4 hours ago', status: 'Escalated to Head' },
    { id: 'TKT-8799', category: 'Tree Fallen', department: 'Parks & Recreation', priority: 'P2', due: '2 days ago', status: 'Warning Sent' },
  ];

  const pendingTickets = [
    { id: 'TKT-8990', category: 'Garbage Collection', department: 'Public Works', priority: 'P3', due: 'in 4 hours', status: 'Assigned' },
    { id: 'TKT-8985', category: 'Street Light', department: 'Electrical', priority: 'P3', due: 'in 8 hours', status: 'In Progress' },
    { id: 'TKT-8970', category: 'Pipe Burst', department: 'Water & Sanitation', priority: 'P1', due: 'in 1 hour', status: 'Assigned' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SLA Escalation Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor Service Level Agreements, pending deadlines, and automated escalations.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Overdue Tickets</p>
            <h3 className="text-2xl font-bold text-red-900 mt-1">24</h3>
          </div>
        </div>
        
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Due in &lt; 24h</p>
            <h3 className="text-2xl font-bold text-amber-900 mt-1">142</h3>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <ShieldAlert className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Active Escalations</p>
            <h3 className="text-2xl font-bold text-blue-900 mt-1">8</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Critical Overdue Tickets
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">ID / Category</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Overdue By</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {overdueTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{ticket.id}</p>
                      <p className="text-xs text-gray-500">{ticket.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.priority === 'P1' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-red-600 font-medium">
                      {ticket.due}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 font-medium">
                        Force Escalate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              Approaching Deadline
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">ID / Category</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Due In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{ticket.id}</p>
                      <p className="text-xs text-gray-500">{ticket.category}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {ticket.department}
                    </td>
                    <td className="px-4 py-3 text-amber-600 font-medium">
                      {ticket.due}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Escalation Rules Config */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Active Escalation Rules</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <h4 className="font-medium text-gray-900 flex items-center">
                P1 Critical Breach <ArrowUpRight className="h-4 w-4 ml-2 text-gray-400" />
              </h4>
              <p className="text-sm text-gray-500 mt-1">If a P1 ticket is overdue by 2 hours, automatically escalate to Department Head.</p>
            </div>
            <div className="flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle1" checked readOnly className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-blue-500 translate-x-5" />
                <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-blue-500 cursor-pointer"></label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <h4 className="font-medium text-gray-900 flex items-center">
                Repeated Overdue Warning <ArrowUpRight className="h-4 w-4 ml-2 text-gray-400" />
              </h4>
              <p className="text-sm text-gray-500 mt-1">If an Officer has &gt;5 overdue tickets, notify Administrator and Dept Head.</p>
            </div>
            <div className="flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle2" checked readOnly className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-blue-500 translate-x-5" />
                <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-blue-500 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
