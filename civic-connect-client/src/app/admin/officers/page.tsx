'use client';

import React, { useEffect, useState } from 'react';
import { User, ShieldAlert, Phone, Mail, Building2, Search, Plus, X, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { API_URL } from '@/lib/api';

export default function OfficersDashboard() {
  const [officers, setOfficers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Officer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', department_id: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOfficers();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${API_URL}/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, department_id: data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${API_URL}/admin/officers`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create officer');
      }
      
      setIsModalOpen(false);
      setFormData({ full_name: '', email: '', password: '', department_id: departments.length > 0 ? departments[0].id : '' });
      fetchOfficers(); // refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-blue-600" /> Officers Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform officers and their department assignments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add New Officer
        </button>
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
                          <p className="font-bold text-gray-900">{officer.full_name || officer.citizenProfile?.full_name || 'Unregistered Name'}</p>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert className="text-blue-600" size={20} /> Add New Officer
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddOfficer} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.full_name}
                  onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Official Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. john.water@civicconnect.gov"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Temporary Password</label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Assign Department</label>
                <select 
                  required
                  value={formData.department_id}
                  onChange={e => setFormData(prev => ({ ...prev, department_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Create Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
