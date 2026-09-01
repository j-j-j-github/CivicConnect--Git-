'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  LogOut, 
  MessageSquare, 
  X, 
  Send, 
  User, 
  ArrowRightLeft, 
  ShieldAlert, 
  MapPin, 
  CheckSquare, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface UserDetail {
  id: string;
  email: string;
  citizenProfile?: {
    full_name: string;
  };
}

interface InternalNote {
  id: string;
  note: string;
  created_at: string;
  officer: {
    id: string;
    email: string;
  };
}

interface Department {
  id: string;
  name: string;
  description: string | null;
  officers?: {
    id: string;
    email: string;
    role: string;
  }[];
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED' | 'REJECTED';
  priority: string;
  location_lat: number | null;
  location_lng: number | null;
  media_urls: string[];
  created_at: string;
  citizen: UserDetail;
  department: Department;
  assigned_officer_id: string | null;
  assigned_officer: {
    id: string;
    email: string;
  } | null;
  internal_notes?: InternalNote[];
  resolution_description?: string | null;
  resolution_media?: string[];
  resolved_at?: string | null;
}

export default function OfficerDashboard() {
  const router = useRouter();
  const [officerInfo, setOfficerInfo] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptOfficers, setDeptOfficers] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Note inputs
  const [newNote, setNewNote] = useState('');
  
  // Resolution inputs
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [resolutionImg, setResolutionImg] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);

  const token = Cookies.get('token');

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/auth/login');
  };

  const fetchInitialData = async () => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 1. Get current officer info
      const meRes = await fetch('http://localhost:3001/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!meRes.ok) throw new Error('Failed to fetch officer profile');
      const meData = await meRes.json();
      setOfficerInfo(meData);

      // 2. Fetch assigned complaints
      const compRes = await fetch('http://localhost:3001/api/v1/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (compRes.ok) {
        const compData = await compRes.json();
        setComplaints(compData);
      }

      // 3. Fetch all departments (for reassignment)
      const deptRes = await fetch('http://localhost:3001/api/v1/departments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (deptRes.ok) {
        const deptData = await deptRes.json();
        setDepartments(deptData);
      }

      // 4. Fetch department officers (for officer assignment)
      if (meData.department_id) {
        const specificDeptRes = await fetch(`http://localhost:3001/api/v1/departments/${meData.department_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (specificDeptRes.ok) {
          const specificDeptData = await specificDeptRes.json();
          setDeptOfficers(specificDeptData.officers || []);
        }
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred while loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const refreshSelectedComplaint = async (complaintId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/complaints/${complaintId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedComplaint(data);
        // Sync back into list
        setComplaints(prev => prev.map(c => c.id === complaintId ? data : c));
      }
    } catch (err) {
      console.error('Failed to refresh complaint', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'VERIFIED' | 'REJECTED' | 'RESOLVED') => {
    try {
      setError('');
      const body: any = { status };
      if (status === 'RESOLVED') {
        if (!resolutionDesc.trim()) {
          alert('Please enter a resolution description.');
          return;
        }
        body.resolution_description = resolutionDesc;
        if (resolutionImg.trim()) {
          body.resolution_media = [resolutionImg];
        }
      }

      const res = await fetch(`http://localhost:3001/api/v1/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Reset resolution form
      setResolutionDesc('');
      setResolutionImg('');
      setShowResolutionForm(false);

      // Refresh
      await refreshSelectedComplaint(id);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !newNote.trim()) return;

    try {
      const res = await fetch(`http://localhost:3001/api/v1/complaints/${selectedComplaint.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: newNote })
      });

      if (!res.ok) throw new Error('Failed to submit internal note');

      setNewNote('');
      await refreshSelectedComplaint(selectedComplaint.id);
    } catch (err: any) {
      alert(err.message || 'Error submitting note');
    }
  };

  const handleAssignOfficer = async (officerId: string) => {
    if (!selectedComplaint) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/complaints/${selectedComplaint.id}/assign-officer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ officer_id: officerId || null })
      });

      if (!res.ok) throw new Error('Failed to assign officer');
      await refreshSelectedComplaint(selectedComplaint.id);
    } catch (err: any) {
      alert(err.message || 'Error assigning officer');
    }
  };

  const handleReassignDepartment = async (deptId: string) => {
    if (!selectedComplaint) return;
    if (!confirm('Are you sure you want to reassign this complaint to another department? It will no longer appear on your dashboard.')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/complaints/${selectedComplaint.id}/reassign-department`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ department_id: deptId })
      });

      if (!res.ok) throw new Error('Failed to reassign department');
      
      // Close modal and remove from list
      setSelectedComplaint(null);
      setComplaints(prev => prev.filter(c => c.id !== selectedComplaint.id));
    } catch (err: any) {
      alert(err.message || 'Error reassigning department');
    }
  };

  // Stats computation
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const progressCount = complaints.filter(c => c.status === 'VERIFIED').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pending Review';
      case 'VERIFIED': return 'In Progress';
      case 'RESOLVED': return 'Resolved';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="bg-[#042B6B] text-white py-5 px-8 flex justify-between items-center shadow-lg border-b border-blue-900">
        <div className="flex items-center gap-3">
          <Building2 size={28} className="text-orange-400 animate-pulse" />
          <h1 className="text-2xl font-black tracking-tight uppercase">CivicConnect <span className="text-orange-400 font-bold text-lg">Department Portal</span></h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all border border-white/20 hover:scale-105 active:scale-95"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12 space-y-8">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#042B6B]/10 to-blue-50 border border-blue-100 p-8 rounded-3xl flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back, Officer</h2>
            <p className="text-gray-600 mt-2 font-medium">
              Department: <span className="text-[#042B6B] font-extrabold">{officerInfo?.department?.name || 'Loading...'}</span>
            </p>
          </div>
          <div className="w-16 h-16 bg-[#042B6B]/10 rounded-2xl flex items-center justify-center text-[#042B6B] border border-blue-200">
            <User size={32} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center gap-3 font-semibold shadow-sm animate-in shake">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Pending Review</p>
              <p className="text-4xl font-black text-red-600">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">In Progress</p>
              <p className="text-4xl font-black text-orange-500">{progressCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Resolved</p>
              <p className="text-4xl font-black text-green-600">{resolvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-black text-gray-900 text-lg tracking-tight flex items-center gap-2">
              <CheckSquare size={20} className="text-[#042B6B]" />
              Assigned Department Grievances
            </h3>
            <span className="bg-blue-100 text-[#042B6B] text-xs font-extrabold px-3 py-1.5 rounded-full">{complaints.length} Total</span>
          </div>

          {loading ? (
            <div className="p-12 text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#042B6B] mx-auto"></div>
              <p className="text-gray-500 font-bold">Fetching latest complaints...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {complaints.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => {
                    setSelectedComplaint(c);
                    refreshSelectedComplaint(c.id);
                  }}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-blue-50/20 transition-all cursor-pointer border-l-4 border-transparent hover:border-[#042B6B]"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5
                        ${c.status === 'VERIFIED' ? 'bg-orange-100 text-orange-700' : ''}
                        ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : ''}
                        ${c.status === 'PENDING' ? 'bg-red-100 text-red-700' : ''}
                        ${c.status === 'REJECTED' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full 
                          ${c.status === 'VERIFIED' ? 'bg-orange-500' : ''}
                          ${c.status === 'RESOLVED' ? 'bg-green-500' : ''}
                          ${c.status === 'PENDING' ? 'bg-red-500' : ''}
                          ${c.status === 'REJECTED' ? 'bg-gray-500' : ''}
                        `}></span>
                        {getStatusLabel(c.status)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                        ${c.priority === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-200' : ''}
                        ${c.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-600 border border-orange-200' : ''}
                        ${c.priority === 'LOW' ? 'bg-blue-50 text-[#042B6B] border border-blue-200' : ''}
                      `}>
                        {c.priority} Priority
                      </span>
                      <span className="text-xs text-gray-400 font-semibold">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-lg leading-tight">{c.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{c.description}</p>
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                      <span>👤 {c.citizen?.citizenProfile?.full_name || 'Citizen'} ({c.citizen?.email})</span>
                      {c.assigned_officer && (
                        <span className="ml-4 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                          👨‍✈️ Assigned to: {c.assigned_officer.email}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto self-end md:self-center">
                    <span className="text-xs font-bold text-[#042B6B] bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-center flex items-center gap-1.5 ml-auto md:ml-0">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              ))}

              {complaints.length === 0 && (
                <div className="p-16 text-center text-gray-500 font-bold bg-white rounded-3xl border border-dashed border-gray-200">
                  <ShieldAlert size={48} className="mx-auto text-gray-300 mb-3" />
                  No grievances assigned to your department.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left Panel: Complaint Details */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 border-b md:border-b-0 md:border-r border-gray-100 max-h-[85vh]">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5
                      ${selectedComplaint.status === 'VERIFIED' ? 'bg-orange-100 text-orange-700' : ''}
                      ${selectedComplaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : ''}
                      ${selectedComplaint.status === 'PENDING' ? 'bg-red-100 text-red-700' : ''}
                      ${selectedComplaint.status === 'REJECTED' ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full 
                        ${selectedComplaint.status === 'VERIFIED' ? 'bg-orange-500' : ''}
                        ${selectedComplaint.status === 'RESOLVED' ? 'bg-green-500' : ''}
                        ${selectedComplaint.status === 'PENDING' ? 'bg-red-500' : ''}
                        ${selectedComplaint.status === 'REJECTED' ? 'bg-gray-500' : ''}
                      `}></span>
                      {getStatusLabel(selectedComplaint.status)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-100 text-[#042B6B]">
                      {selectedComplaint.priority} Priority
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedComplaint.title}</h2>
                  <p className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                    <Calendar size={14} /> Reported on {new Date(selectedComplaint.created_at).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedComplaint(null)} 
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors md:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm whitespace-pre-wrap">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Submitted By</h3>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                      <p className="font-bold text-gray-800">{selectedComplaint.citizen?.citizenProfile?.full_name || 'Citizen'}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{selectedComplaint.citizen?.email}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Location</h3>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm flex items-center gap-2">
                      <MapPin size={16} className="text-[#042B6B] flex-shrink-0" />
                      <div>
                        {selectedComplaint.location_lat ? (
                          <p className="font-bold text-gray-800 text-xs">
                            Lat: {selectedComplaint.location_lat.toFixed(5)}<br/>
                            Lng: {selectedComplaint.location_lng?.toFixed(5)}
                          </p>
                        ) : (
                          <p className="text-gray-500">Not specified</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Uploads (Citizen) */}
                {selectedComplaint.media_urls && selectedComplaint.media_urls.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Citizen Evidence</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedComplaint.media_urls.map((url, i) => (
                        <a 
                          key={i} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-xs text-[#042B6B] font-bold truncate hover:underline"
                        >
                          🔗 Attachment {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution Info (If Resolved) */}
                {selectedComplaint.status === 'RESOLVED' && (
                  <div className="bg-green-50 border border-green-200 p-5 rounded-2xl space-y-3">
                    <h4 className="text-green-800 font-extrabold text-sm flex items-center gap-2">
                      <CheckCircle size={16} /> Resolution Information
                    </h4>
                    <p className="text-green-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedComplaint.resolution_description || 'No description provided.'}</p>
                    {selectedComplaint.resolution_media && selectedComplaint.resolution_media.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs text-green-800 font-bold block mb-1">Resolution Attachments:</span>
                        {selectedComplaint.resolution_media.map((url, i) => (
                          <a 
                            key={i} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-block bg-white border border-green-200 p-2 rounded-lg text-xs text-green-800 font-bold mr-2 hover:underline"
                          >
                            🔗 Resolution Image {i + 1}
                          </a>
                        ))}
                      </div>
                    )}
                    {selectedComplaint.resolved_at && (
                      <p className="text-xs text-green-600 font-semibold mt-1">Resolved on {new Date(selectedComplaint.resolved_at).toLocaleString()}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Status Actions Form */}
              {selectedComplaint.status !== 'RESOLVED' && selectedComplaint.status !== 'REJECTED' && (
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Complaint Processing Workflow</h3>
                  
                  {selectedComplaint.status === 'PENDING' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateStatus(selectedComplaint.id, 'VERIFIED')}
                        className="flex-1 py-3 px-4 bg-[#042B6B] text-white text-sm font-extrabold rounded-xl hover:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        Accept Case
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedComplaint.id, 'REJECTED')}
                        className="py-3 px-4 bg-red-50 text-red-600 text-sm font-extrabold rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {selectedComplaint.status === 'VERIFIED' && (
                    <div className="space-y-4">
                      {!showResolutionForm ? (
                        <button
                          onClick={() => setShowResolutionForm(true)}
                          className="w-full py-3 px-4 bg-green-600 text-white text-sm font-extrabold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                        >
                          Mark as Resolved
                        </button>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-4 animate-in slide-in-from-bottom-2">
                          <h4 className="text-sm font-black text-gray-800">Resolution Evidence Details</h4>
                          
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-600">Resolution Description</label>
                            <textarea
                              rows={3}
                              placeholder="Detail the work done to resolve this grievance..."
                              value={resolutionDesc}
                              onChange={e => setResolutionDesc(e.target.value)}
                              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none"
                            ></textarea>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-600">Resolution Media URL (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. http://minio-url/evidence.jpg"
                              value={resolutionImg}
                              onChange={e => setResolutionImg(e.target.value)}
                              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none"
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setShowResolutionForm(false);
                                setResolutionDesc('');
                                setResolutionImg('');
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(selectedComplaint.id, 'RESOLVED')}
                              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700"
                            >
                              Submit Resolution
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Panel: Reassignments & Internal Notes */}
            <div className="w-full md:w-96 p-6 md:p-8 bg-gray-50/50 flex flex-col justify-between max-h-[85vh]">
              <div className="space-y-6 overflow-y-auto flex-1 pr-1">
                <div className="flex justify-between items-center hidden md:flex">
                  <h3 className="font-black text-gray-900 text-sm tracking-tight">Case Management</h3>
                  <button 
                    onClick={() => setSelectedComplaint(null)} 
                    className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Assignment Blocks */}
                <div className="space-y-4">
                  {/* Department Assignment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <ArrowRightLeft size={12} /> Assigned Department
                    </label>
                    <select
                      value={selectedComplaint.department.id}
                      onChange={e => handleReassignDepartment(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#042B6B] shadow-sm cursor-pointer"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Officer Assignment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <User size={12} /> Assigned Officer
                    </label>
                    <select
                      value={selectedComplaint.assigned_officer_id || ''}
                      onChange={e => handleAssignOfficer(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#042B6B] shadow-sm cursor-pointer"
                    >
                      <option value="">-- Unassigned --</option>
                      {deptOfficers.map(o => (
                        <option key={o.id} value={o.id}>{o.email}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Internal Notes Feed */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={13} /> Internal Collaboration Notes
                  </h4>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {selectedComplaint.internal_notes && selectedComplaint.internal_notes.length > 0 ? (
                      selectedComplaint.internal_notes.map((note) => (
                        <div key={note.id} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm text-xs space-y-1">
                          <div className="flex justify-between text-gray-400 font-bold">
                            <span className="truncate max-w-[150px]" title={note.officer.email}>{note.officer.email}</span>
                            <span>{new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{note.note}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-xs italic text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">No internal notes posted.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Note Form (Sticky Bottom) */}
              <form onSubmit={handleAddNote} className="pt-4 border-t border-gray-100 mt-4 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Post internal collab note..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#042B6B] shadow-sm"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-[#042B6B] hover:bg-blue-900 text-white rounded-xl transition-colors shadow-sm flex items-center justify-center"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
