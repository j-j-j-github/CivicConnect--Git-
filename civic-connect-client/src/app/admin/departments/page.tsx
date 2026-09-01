'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { ArrowLeft, Plus, Edit2, Trash2, X, Building } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    complaints: number;
    officers: number;
  };
}

const mockDepartments: Department[] = [
  { id: '1', name: 'Public Works (PWD)', description: 'Handles road maintenance, potholes, and public infrastructure development.', _count: { complaints: 14, officers: 3 } },
  { id: '2', name: 'Water Authority', description: 'Manages water supply, pipe leakages, and sewage line clearing.', _count: { complaints: 8, officers: 2 } },
  { id: '3', name: 'Electricity Board', description: 'Responsible for streetlights, power outages, and electrical hazards.', _count: { complaints: 11, officers: 4 } },
];

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<Department | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const token = Cookies.get('token');

  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/departments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
      } else {
        setDepartments(mockDepartments);
      }
    } catch (err) {
      setDepartments(mockDepartments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/v1/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });

      if (!res.ok) throw new Error('Failed to create department');
      
      setIsAddOpen(false);
      setName('');
      setDescription('');
      fetchDepartments();
    } catch (err: any) {
      // Local addition fallback if API is not available
      const newDept: Department = {
        id: Date.now().toString(),
        name,
        description,
        _count: { complaints: 0, officers: 0 }
      };
      setDepartments([newDept, ...departments]);
      setIsAddOpen(false);
      setName('');
      setDescription('');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDept) return;
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/v1/departments/${currentDept.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });

      if (!res.ok) throw new Error('Failed to update department');
      
      setIsEditOpen(false);
      fetchDepartments();
    } catch (err: any) {
      // Local fallback
      setDepartments(departments.map(d => d.id === currentDept.id ? { ...d, name, description } : d));
      setIsEditOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete department');
      fetchDepartments();
    } catch (err) {
      // Local fallback
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  const openEdit = (dept: Department) => {
    setCurrentDept(dept);
    setName(dept.name);
    setDescription(dept.description || '');
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans animate-in fade-in duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Nav & Action */}
        <div className="flex justify-between items-center">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#042B6B] hover:underline font-bold transition-all hover:-translate-x-1">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <button
            onClick={() => { setName(''); setDescription(''); setIsAddOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#042B6B] text-white font-bold rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Department
          </button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-[#042B6B] tracking-tight">Configure Departments</h1>
          <p className="text-gray-500 mt-2">Manage city administrative divisions and their details.</p>
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 h-48"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <Building size={16} />
                    </div>
                    <h3 className="font-extrabold text-gray-900 leading-tight">{dept.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{dept.description || 'No description provided.'}</p>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  {dept._count && (
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                      <span>{dept._count.complaints} complaints</span>
                      <span>{dept._count.officers} officers</span>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(dept)}
                      className="p-2 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="p-2 bg-gray-50 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {departments.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
                No departments configured yet. Click 'Add Department' above.
              </div>
            )}
          </div>
        )}

        {/* Add Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add New Department</h3>
                <button onClick={() => setIsAddOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-gray-700" htmlFor="add-name">Name</label>
                  <input
                    id="add-name"
                    type="text"
                    required
                    placeholder="e.g. Health Department"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#042B6B] focus:outline-none focus:ring-1 focus:ring-[#042B6B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-gray-700" htmlFor="add-desc">Description</label>
                  <textarea
                    id="add-desc"
                    rows={4}
                    placeholder="Provide a brief summary of responsibilities..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#042B6B] focus:outline-none focus:ring-1 focus:ring-[#042B6B]"
                  ></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#042B6B] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Edit Department</h3>
                <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-gray-700" htmlFor="edit-name">Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    placeholder="e.g. Health Department"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#042B6B] focus:outline-none focus:ring-1 focus:ring-[#042B6B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-gray-700" htmlFor="edit-desc">Description</label>
                  <textarea
                    id="edit-desc"
                    rows={4}
                    placeholder="Provide a brief summary of responsibilities..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-[#042B6B] focus:outline-none focus:ring-1 focus:ring-[#042B6B]"
                  ></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#042B6B] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
