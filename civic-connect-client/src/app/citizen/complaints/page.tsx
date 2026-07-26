'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Lightbulb, Clock, CheckCircle, MapPin, X } from 'lucide-react';

export default function ReportsPage() {
  const [allComplaints, setAllComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('civic_complaints');
    if (saved) {
      setAllComplaints(JSON.parse(saved));
    }
  }, []);

  const getIcon = (status: string) => {
    if (status === 'Resolved') return <CheckCircle size={20} className="text-gray-600" />;
    if (status === 'In Progress') return <AlertTriangle size={20} className="text-gray-600" />;
    if (status === 'Pending') return <Clock size={20} className="text-gray-600" />;
    return <Lightbulb size={20} className="text-gray-600" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Reports</h1>
          <p className="text-gray-500 mt-2 text-lg">Track the status of all your submitted civic issues.</p>
        </div>
        <Link 
          href="/citizen/complaints/new" 
          className="px-6 py-3 bg-[#1E3A8A] text-white font-bold rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
        >
          + New Report
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-semibold text-gray-500">
                <th className="p-5 font-semibold">Issue</th>
                <th className="p-5 font-semibold">Date Submitted</th>
                <th className="p-5 font-semibold">Department</th>
                <th className="p-5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allComplaints.map(c => (
                <tr 
                  key={c.id} 
                  onClick={() => setSelectedComplaint(c)}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getIcon(c.status)}
                      </div>
                      <span className="font-bold text-gray-900">{c.title}</span>
                    </div>
                  </td>
                  <td className="p-5 text-gray-500 text-sm">{c.date}</td>
                  <td className="p-5 text-gray-500 text-sm">{c.category || c.department}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                      ${c.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : ''}
                      ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : ''}
                      ${c.status === 'Pending' ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full 
                        ${c.status === 'In Progress' ? 'bg-orange-500' : ''}
                        ${c.status === 'Resolved' ? 'bg-green-500' : ''}
                        ${c.status === 'Pending' ? 'bg-gray-400' : ''}
                      `}></span>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {allComplaints.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 mb-3 inline-flex
                  ${selectedComplaint.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : ''}
                  ${selectedComplaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : ''}
                  ${selectedComplaint.status === 'Pending' ? 'bg-gray-100 text-gray-700' : ''}
                `}>
                  <span className={`w-1.5 h-1.5 rounded-full 
                    ${selectedComplaint.status === 'In Progress' ? 'bg-orange-500' : ''}
                    ${selectedComplaint.status === 'Resolved' ? 'bg-green-500' : ''}
                    ${selectedComplaint.status === 'Pending' ? 'bg-gray-400' : ''}
                  `}></span>
                  {selectedComplaint.status}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedComplaint.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Reported on {selectedComplaint.date}</p>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</h3>
                <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedComplaint.category || selectedComplaint.department || 'Unknown'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">{selectedComplaint.description || 'No description provided.'}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Location
                </h3>
                <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {selectedComplaint.address || (selectedComplaint.lat ? `Lat: ${selectedComplaint.lat.toFixed(4)}, Lng: ${selectedComplaint.lng.toFixed(4)}` : 'Location not provided')}
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
