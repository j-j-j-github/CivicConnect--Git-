'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Lightbulb, ArrowRight, Clock, CheckCircle, MapPin, X } from 'lucide-react';

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);

  useEffect(() => {
    // Default initial mock data if empty
    const defaultData = [
      { 
        id: '1', 
        title: 'Pothole on Main St', 
        date: 'Oct 12, 2023', 
        status: 'In Progress', 
        category: 'Public Works',
        description: 'Large pothole causing severe traffic delays and potential damage to vehicles.',
        address: '123 Main St, City Center',
        lat: 40.7128, lng: -74.0060
      },
      { 
        id: '2', 
        title: 'Broken Streetlight', 
        date: 'Oct 05, 2023', 
        status: 'Resolved', 
        category: 'Electricity',
        description: 'Streetlight completely out at intersection, making it very dark at night.',
        address: '45 Elm St, Westside',
        lat: 40.7150, lng: -74.0020
      },
    ];

    const saved = localStorage.getItem('civic_complaints');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setComplaints(parsed);
      } else {
        setComplaints(defaultData);
        localStorage.setItem('civic_complaints', JSON.stringify(defaultData));
      }
    } else {
      setComplaints(defaultData);
      localStorage.setItem('civic_complaints', JSON.stringify(defaultData));
    }
  }, []);

  const getIcon = (status: string) => {
    if (status === 'Resolved') return <CheckCircle size={20} className="text-gray-600" />;
    if (status === 'In Progress') return <AlertTriangle size={20} className="text-gray-600" />;
    return <Clock size={20} className="text-gray-600" />;
  };

  const activeReportsCount = complaints.filter(c => c.status !== 'Resolved').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Greeting */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          Hello, Jeeval <span className="text-3xl">👋</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Here's your civic engagement overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-sm text-gray-500 font-semibold mb-2">Active Reports</p>
          <p className="text-5xl font-bold text-gray-900">{activeReportsCount}</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-sm text-gray-500 font-semibold mb-2">Resolved</p>
          <p className="text-5xl font-bold text-gray-900">{resolvedCount}</p>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-[#1E3A8A] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-blue-900/10">
        <div className="flex items-start gap-4 mb-6 md:mb-0">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            {/* Small subtle dot in the square */}
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Help improve your city</h2>
            <p className="text-blue-200 text-sm max-w-md leading-relaxed">
              Notice something that needs fixing? Report it directly to local authorities.
            </p>
          </div>
        </div>
        
        <Link 
          href="/citizen/complaints/new" 
          className="w-full md:w-auto px-6 py-3 bg-white text-[#1E3A8A] font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
        >
          Report a Civic Issue <ArrowRight size={18} />
        </Link>
      </div>

      {/* Recent Complaints List */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Complaints</h2>
          <Link href="/citizen/complaints" className="text-sm font-bold text-[#1E3A8A] hover:underline">
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          {complaints.slice(0, 3).map((c) => (
            <div 
              key={c.id} 
              onClick={() => setSelectedComplaint(c)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-gray-300 transition-all cursor-pointer"
            >
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  {getIcon(c.status)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{c.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">{c.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5
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
                <div className="text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
              
            </div>
          ))}
          {complaints.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
              You haven't reported any issues yet.
            </div>
          )}
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
                <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedComplaint.category || 'Unknown'}</p>
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
