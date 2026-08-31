import React from 'react';
import Link from 'next/link';
import { Users, FileWarning, Clock, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Citizens', value: '12,450', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Complaints', value: '845', change: '-5%', icon: FileWarning, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Overdue Tickets', value: '32', change: '+2', icon: Clock, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Resolution Rate', value: '92%', change: '+4%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const recentActivity = [
    { id: 1, action: 'Escalated Ticket #4920', user: 'System', time: '10 mins ago', type: 'escalation' },
    { id: 2, action: 'User role updated: j.doe to Officer', user: 'Arjun Ghosh', time: '1 hour ago', type: 'user' },
    { id: 3, action: 'New Department added: Public Works', user: 'Arjun Ghosh', time: '2 hours ago', type: 'department' },
    { id: 4, action: 'SLA Rule modified: P1 resolution time', user: 'Arjun Ghosh', time: '5 hours ago', type: 'system' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard Overview</h1>
        <div className="flex space-x-3">
          <Link href="/admin/reports" className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export Report
          </Link>
          <Link href="/admin/settings" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            System Settings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/users" className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
              <Users className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Manage Users</p>
                <p className="text-xs text-gray-500">Add or modify roles</p>
              </div>
            </Link>
            <Link href="/admin/sla" className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
              <ShieldAlert className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">SLA Dashboard</p>
                <p className="text-xs text-gray-500">Monitor overdue items</p>
              </div>
            </Link>
            <Link href="/admin/analytics" className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
              <TrendingUp className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">View Analytics</p>
                <p className="text-xs text-gray-500">Platform performance</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent System Activity</h2>
            <Link href="/admin/audit-logs" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all logs &rarr;
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 z-10">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  </div>
                  {activity.id !== recentActivity.length && (
                    <div className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
