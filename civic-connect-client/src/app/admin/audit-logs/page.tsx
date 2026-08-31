import React from 'react';
import { Search, Filter, Download, Terminal, User, FileWarning } from 'lucide-react';

export default function AuditLogsPage() {
  const logs = [
    { id: 'LOG-001', type: 'system', action: 'Automated DB Backup', user: 'System', time: '2026-08-31 02:00:00', status: 'Success', detail: 'Backup completed successfully.' },
    { id: 'LOG-002', type: 'user', action: 'User Login', user: 'Arjun Ghosh', time: '2026-08-31 08:15:22', status: 'Success', detail: 'IP: 192.168.1.45' },
    { id: 'LOG-003', type: 'action', action: 'Escalation Triggered', user: 'System (SLA)', time: '2026-08-31 09:30:11', status: 'Warning', detail: 'Ticket TKT-8942 escalated to Dept Head.' },
    { id: 'LOG-004', type: 'user', action: 'Role Update', user: 'Arjun Ghosh', time: '2026-08-31 10:45:00', status: 'Success', detail: 'Updated role of user jane.doe to Officer.' },
    { id: 'LOG-005', type: 'system', action: 'Failed API Request', user: 'External Service', time: '2026-08-31 11:12:05', status: 'Error', detail: 'Timeout connecting to GIS mapping service.' },
    { id: 'LOG-006', type: 'user', action: 'Report Generated', user: 'Maria Garcia', time: '2026-08-31 13:20:45', status: 'Success', detail: 'Monthly performance CSV export.' },
    { id: 'LOG-007', type: 'action', action: 'SLA Rule Modified', user: 'Arjun Ghosh', time: '2026-08-31 14:05:10', status: 'Success', detail: 'Changed P1 resolution time from 48h to 24h.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive history of system activities, user actions, and automated events.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by action, user, or details..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white whitespace-nowrap">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Event Type
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white whitespace-nowrap">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Date Range
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white whitespace-nowrap">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Status
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">User / Source</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">
                    {log.time}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {log.type === 'system' ? <Terminal className="h-4 w-4 text-slate-400 mr-2" /> :
                       log.type === 'user' ? <User className="h-4 w-4 text-blue-400 mr-2" /> :
                       <FileWarning className="h-4 w-4 text-amber-400 mr-2" />}
                      <div>
                        <p className="font-semibold text-gray-900 font-sans">{log.action}</p>
                        <p className="text-gray-500 mt-1 max-w-md truncate">{log.detail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {log.user}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded font-sans text-xs font-medium border ${
                      log.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      log.status === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <span>Showing 7 of 1,248 logs</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-blue-50 text-blue-600 font-medium">1</button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50">3</button>
            <span className="px-2 py-1">...</span>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
