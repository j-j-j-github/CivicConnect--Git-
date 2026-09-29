'use client';

import React, { useEffect, useState } from 'react';
import { User, ShieldAlert, Phone, Mail, Building2, Search } from 'lucide-react';
import Cookies from 'js-cookie';
import { API_URL } from '@/lib/api';

export default function OfficersDashboard() {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${API_URL}/admin/officers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOfficers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading officers...</div>;

  const filteredOfficers = officers.filter(o => 
    o.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.citizenProfile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-blue-600" /> Officers Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform officers and their department assignments.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search officers or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">Officer Details</th>
                <th className="px-6 py-4 font-bold">Department</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No officers found.
                  </td>
                </tr>
              ) : (
                filteredOfficers.map(officer => (
                  <tr key={officer.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{officer.citizenProfile?.full_name || 'Unregistered Name'}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={12}/> {officer.email}</p>
                          {officer.citizenProfile?.phone && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={12}/> {officer.citizenProfile.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {officer.department ? (
                        <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold w-max border border-blue-100">
                          <Building2 size={14} />
                          {officer.department.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-xs rounded">
                        OFFICER
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(officer.created_at).toLocaleDateString()}
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
