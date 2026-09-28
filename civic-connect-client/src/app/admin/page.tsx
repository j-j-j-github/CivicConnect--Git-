'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileWarning, CheckCircle, Clock, Bell, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const res = await fetch('http://localhost:3001/api/v1/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeptId || !messageContent.trim()) return;

    setIsSending(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`http://localhost:3001/api/v1/admin/message-department/${selectedDeptId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageContent })
      });
      if (!res.ok) throw new Error('Failed to send message');
      alert('Message sent successfully!');
      setIsMessageModalOpen(false);
      setMessageContent('');
    } catch (err: any) {
      alert(err.message || 'Error sending message');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading live database metrics...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!stats) return null;

  const statCards = [
    { name: 'Total Citizens', value: stats.usersCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Complaints', value: stats.activeComplaints, icon: FileWarning, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Resolved Complaints', value: stats.resolvedComplaints, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Resolution Rate', value: `${stats.resolutionRate}%`, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Live data feed from database</p>
        </div>
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
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{stats.departmentsCount} Departments</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold text-center">Officers</th>
                  <th className="px-6 py-4 font-semibold text-center">Active</th>
                  <th className="px-6 py-4 font-semibold text-center">Resolved</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.departments.map((dept: any) => (
                  <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 text-center">{dept.totalOfficers}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        {dept.activeComplaints}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-emerald-600 font-medium">{dept.resolvedComplaints}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDeptId(dept.id);
                          setIsMessageModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Bell size={14} /> Ping
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Cases Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
          </div>
          <div className="p-6 space-y-6">
            {stats.recentComplaints.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No cases found.</p>
            ) : (
              stats.recentComplaints.map((c: any) => (
                <div key={c.id} className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                      <FileWarning size={14} className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {c.citizen?.citizenProfile?.full_name || c.citizen?.email || 'Unknown'} • {new Date(c.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        {c.status}
                      </span>
                      {c.ai_category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                          AI: {c.ai_category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-blue-600" /> Ping Department
              </h3>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Send a direct notification to all officers in this department. They will see this message in their dashboard.
              </p>
              <textarea
                required
                rows={4}
                placeholder="Type your message here..."
                value={messageContent}
                onChange={e => setMessageContent(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none shadow-sm placeholder-gray-400 text-gray-800"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                >
                  {isSending ? 'Sending...' : <><Send size={16} /> Send</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
