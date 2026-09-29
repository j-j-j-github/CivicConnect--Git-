'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Search, Bell, ShieldAlert, CheckCircle, FileWarning, ArrowLeft, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_URL } from '@/lib/api';

export default function DepartmentsManagement() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Fetch stats and complaints concurrently
      const [statsRes, compRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/complaints`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDepartments(statsData.departments);
      }
      if (compRes.ok) {
        const compData = await compRes.json();
        setComplaints(compData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !messageContent.trim()) return;

    setIsSending(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${API_URL}/admin/message-department/${selectedDept.id}`, {
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading department data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Render department details if one is selected
  if (selectedDept) {
    const deptComplaints = complaints.filter(c => c.department?.id === selectedDept.id);
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <button onClick={() => setSelectedDept(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="text-blue-600" /> {selectedDept.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Detailed view of department operations and complaints</p>
          </div>
          <div className="ml-auto flex gap-3">
            <button 
              onClick={() => setIsMessageModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Bell size={16} /> Ping Admins
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Officers</h3>
            <span className="text-4xl font-black text-gray-900">{selectedDept.totalOfficers}</span>
          </div>
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-amber-700 uppercase tracking-wider mb-2 text-center">Active Complaints</h3>
            <span className="text-4xl font-black text-amber-900">{selectedDept.activeComplaints}</span>
          </div>
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-emerald-700 uppercase tracking-wider mb-2 text-center">Resolved Complaints</h3>
            <span className="text-4xl font-black text-emerald-900">{selectedDept.resolvedComplaints}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileWarning size={18} className="text-blue-600" /> Complaints Assigned to {selectedDept.name}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-bold">Complaint Title</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Priority</th>
                  <th className="px-6 py-4 font-bold">AI Category</th>
                  <th className="px-6 py-4 font-bold">Reported By</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deptComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No complaints assigned to this department.
                    </td>
                  </tr>
                ) : (
                  deptComplaints.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{c.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                          ${c.status === 'PENDING' ? 'bg-red-100 text-red-700' : ''}
                          ${c.status === 'VERIFIED' ? 'bg-amber-100 text-amber-700' : ''}
                          ${c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : ''}
                          ${c.status === 'REJECTED' ? 'bg-gray-200 text-gray-700' : ''}
                        `}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-700 uppercase text-xs">{c.priority}</span>
                      </td>
                      <td className="px-6 py-4">
                        {c.ai_category ? (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{c.ai_category}</span>
                        ) : <span className="text-gray-400 text-xs italic">N/A</span>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{c.citizen?.citizenProfile?.full_name || 'Citizen'}</p>
                        <p className="text-xs text-gray-500">{c.citizen?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Message Modal */}
        {isMessageModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Bell size={18} className="text-blue-600" /> Message {selectedDept.name}
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
                  Send a direct broadcast to all officers in {selectedDept.name}.
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

  // Render department list
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Department Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor all government departments</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search departments..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">Department</th>
                <th className="px-6 py-4 font-bold text-center">Officers</th>
                <th className="px-6 py-4 font-bold text-center">Active Cases</th>
                <th className="px-6 py-4 font-bold text-center">Resolved</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No departments found in the database.
                  </td>
                </tr>
              ) : (
                departments.map(dept => (
                  <tr key={dept.id} className="hover:bg-blue-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedDept(dept)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {dept.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{dept.name}</p>
                          <p className="text-xs text-gray-500">ID: {dept.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{dept.totalOfficers}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800">
                        {dept.activeComplaints}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{dept.resolvedComplaints}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedDept(dept); }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
