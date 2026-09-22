"use client"

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

export default function AnalyticsDashboard() {
  // Mock Data
  const trendData = [
    { name: 'Jan', complaints: 400, resolved: 240 },
    { name: 'Feb', complaints: 300, resolved: 139 },
    { name: 'Mar', complaints: 200, resolved: 980 },
    { name: 'Apr', complaints: 278, resolved: 390 },
    { name: 'May', complaints: 189, resolved: 480 },
    { name: 'Jun', complaints: 239, resolved: 380 },
    { name: 'Jul', complaints: 349, resolved: 430 },
  ];

  const deptPerformanceData = [
    { name: 'Public Works', active: 145, resolved: 850 },
    { name: 'Water', active: 312, resolved: 1200 },
    { name: 'Traffic', active: 89, resolved: 450 },
    { name: 'Parks', active: 45, resolved: 210 },
    { name: 'Electrical', active: 254, resolved: 650 },
  ];

  const categoryData = [
    { name: 'Potholes', value: 400 },
    { name: 'Water Leak', value: 300 },
    { name: 'Street Light', value: 300 },
    { name: 'Garbage', value: 200 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform-wide statistics, trends, and department performance metrics.</p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Complaint Trends (Last 7 Months)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Department Workload & Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f3f4f6' }} />
                <Legend />
                <Bar dataKey="active" name="Active Tickets" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="resolved" name="Resolved Tickets" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Complaint Categories</h3>
          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resolution Time Metrics (SLA)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <p className="text-sm text-gray-500">Average P1</p>
              <p className="text-2xl font-bold text-red-600 mt-1">18 hrs</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <p className="text-sm text-gray-500">Average P2</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">36 hrs</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <p className="text-sm text-gray-500">Average P3</p>
              <p className="text-2xl font-bold text-amber-500 mt-1">4.2 days</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <p className="text-sm text-gray-500">Citizen CSAT</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">4.6 / 5</p>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100 text-sm">
            <strong>Insight:</strong> Resolution times for P1 and P2 complaints are within the global SLA targets. However, the Water department has seen a 15% increase in overdue P3 tickets over the last month.
          </div>
        </div>
      </div>
    </div>
  );
}
