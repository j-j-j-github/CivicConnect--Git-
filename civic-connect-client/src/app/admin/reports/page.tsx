import React from 'react';
import { FileText, FileBarChart, Download, FileJson, Search, Calendar, ChevronDown } from 'lucide-react';

export default function ReportsPage() {
  const recentReports = [
    { id: 'REP-2026-08', name: 'August Performance Summary', type: 'Monthly', format: 'PDF', generated: '2 hours ago', by: 'System Auto-Gen' },
    { id: 'REP-2026-07', name: 'July Performance Summary', type: 'Monthly', format: 'PDF', generated: 'Aug 1, 2026', by: 'System Auto-Gen' },
    { id: 'EXP-1294', name: 'Raw SLA Data - Q2', type: 'Data Export', format: 'CSV', generated: 'Jul 15, 2026', by: 'Arjun Ghosh' },
    { id: 'REP-2026-06', name: 'June Performance Summary', type: 'Monthly', format: 'PDF', generated: 'Jul 1, 2026', by: 'System Auto-Gen' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Report Generation</h1>
        <p className="text-sm text-gray-500 mt-1">Generate, view, and export detailed system and performance reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate Report Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Create New Report</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <div className="relative">
                <select className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                  <option>Department Performance</option>
                  <option>SLA Compliance</option>
                  <option>Citizen Satisfaction</option>
                  <option>Raw Complaint Data</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type="date" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type="date" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Department (Optional)</label>
              <div className="relative">
                <select className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-500">
                  <option>All Departments</option>
                  <option>Public Works</option>
                  <option>Water & Sanitation</option>
                  <option>Traffic & Transport</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <div className="flex space-x-4">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                  <input type="radio" name="format" value="pdf" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" defaultChecked />
                  <FileText className="h-5 w-5 text-red-500 ml-3 mr-2" />
                  <span className="text-sm font-medium text-gray-900">PDF Report</span>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                  <input type="radio" name="format" value="csv" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <FileBarChart className="h-5 w-5 text-emerald-500 ml-3 mr-2" />
                  <span className="text-sm font-medium text-gray-900">CSV Export</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Generate & Download
              </button>
            </div>
          </div>
        </div>

        {/* Recent Reports List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Reports</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {recentReports.map((report) => (
                <li key={report.id} className="p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="mt-1">
                        {report.format === 'PDF' ? (
                          <FileText className="h-6 w-6 text-red-500" />
                        ) : report.format === 'CSV' ? (
                          <FileBarChart className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <FileJson className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{report.name}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                          <span>{report.id}</span>
                          <span>•</span>
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{report.generated}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Generated by {report.by}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
