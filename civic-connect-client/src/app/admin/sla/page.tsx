'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { API_URL } from '@/lib/api';

export default function SlaTrackingDashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      const compRes = await fetch(`${API_URL}/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (compRes.ok) {
        const data = await compRes.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading SLA data...</div>;

  const now = new Date();

  // SLA Rules (hours)
  const slaRules: Record<string, number> = {
    CRITICAL: 12,
    HIGH: 24,
    MEDIUM: 72,
    LOW: 168
  };

  const activeComplaints = complaints.filter(c => c.status === 'PENDING' || c.status === 'VERIFIED');

  let overdueCount = 0;
  let atRiskCount = 0;
  let healthyCount = 0;

  const slaData = activeComplaints.map(c => {
    const created = new Date(c.created_at);
    const limitHours = slaRules[c.priority] || 72; // Default 72h
    const dueTime = new Date(created.getTime() + limitHours * 60 * 60 * 1000);
    const msRemaining = dueTime.getTime() - now.getTime();
    const hoursRemaining = msRemaining / (1000 * 60 * 60);

    let slaStatus = 'HEALTHY';
    if (hoursRemaining < 0) {
      slaStatus = 'OVERDUE';
      overdueCount++;
    } else if (hoursRemaining < 24) {
      slaStatus = 'AT_RISK';
      atRiskCount++;
    } else {
      healthyCount++;
    }

    return { ...c, dueTime, hoursRemaining, slaStatus };
  });

  const sortedSlaData = slaData.sort((a, b) => a.hoursRemaining - b.hoursRemaining);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Clock className="text-blue-600" /> SLA Tracking & Escalation
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor Service Level Agreements and overdue tickets across all departments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm flex flex-col items-center justify-center">
          <AlertTriangle className="text-red-500 mb-2" size={24} />
          <h3 className="text-sm font-medium text-red-700 uppercase tracking-wider mb-1 text-center">Overdue Tickets</h3>
          <span className="text-4xl font-black text-red-900">{overdueCount}</span>
        </div>
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col items-center justify-center">
          <Clock className="text-amber-500 mb-2" size={24} />
          <h3 className="text-sm font-medium text-amber-700 uppercase tracking-wider mb-1 text-center">Due &lt; 24h (At Risk)</h3>
          <span className="text-4xl font-black text-amber-900">{atRiskCount}</span>
        </div>
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col items-center justify-center">
          <CheckCircle className="text-emerald-500 mb-2" size={24} />
          <h3 className="text-sm font-medium text-emerald-700 uppercase tracking-wider mb-1 text-center">Healthy Tickets</h3>
          <span className="text-4xl font-black text-emerald-900">{healthyCount}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert size={18} className="text-blue-600" /> Active Tickets by Urgency
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">Ticket Details</th>
                <th className="px-6 py-4 font-bold">Department</th>
                <th className="px-6 py-4 font-bold">Priority</th>
                <th className="px-6 py-4 font-bold">SLA Status</th>
                <th className="px-6 py-4 font-bold">Time Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedSlaData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No active tickets to track.
                  </td>
                </tr>
              ) : (
                sortedSlaData.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{ticket.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        {ticket.status} • {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {ticket.department?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-700 uppercase text-xs">{ticket.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.slaStatus === 'OVERDUE' && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 w-max">
                          <AlertTriangle size={12} /> Overdue
                        </span>
                      )}
                      {ticket.slaStatus === 'AT_RISK' && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 w-max">
                          <Clock size={12} /> At Risk
                        </span>
                      )}
                      {ticket.slaStatus === 'HEALTHY' && (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 w-max">
                          <CheckCircle size={12} /> Healthy
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {ticket.hoursRemaining < 0 ? (
                        <span className="text-red-600 font-bold">Overdue by {Math.abs(Math.round(ticket.hoursRemaining))} hrs</span>
                      ) : (
                        <span className="text-gray-700 font-medium">{Math.round(ticket.hoursRemaining)} hrs remaining</span>
                      )}
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
