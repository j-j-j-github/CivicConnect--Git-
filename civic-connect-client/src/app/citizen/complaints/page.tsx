'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Lightbulb, Clock, CheckCircle, MapPin, X, Loader2, Star, RefreshCw } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function ReportsPage() {
  const [allComplaints, setAllComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Reopen State
  const [reopenLoading, setReopenLoading] = useState(false);
  const [reopenSuccess, setReopenSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/complaints/my');
      if (data) {
        const mapped = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          date: new Date(c.created_at).toLocaleDateString(),
          status: c.status === 'PENDING' ? 'Pending' : c.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved',
          priority: c.priority || 'LOW',
          category: c.department?.name || 'General',
          description: c.description,
          ai_summary: c.ai_summary,
          ai_category: c.ai_category,
          ai_department: c.ai_department,
          ai_priority: c.ai_priority,
          ai_confidence: c.ai_confidence,
          is_ai_overridden: c.is_ai_overridden,
          override_reason: c.override_reason,
          address: `Lat: ${c.location_lat}, Lng: ${c.location_lng}`,
          lat: c.location_lat,
          lng: c.location_lng,
          feedback: c.feedback || null
        }));
        setAllComplaints(mapped);
      }
    } catch (error) {
      console.error('Failed to load complaints', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setFeedbackLoading(true);
    try {
      await fetchApi(`/complaints/${selectedComplaint.id}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ rating, comments }),
      });
      setFeedbackSuccess(true);
      await loadData();
      // Update selected complaint with feedback locally so UI updates immediately
      setSelectedComplaint({ ...selectedComplaint, feedback: [{ rating, comments }] });
    } catch (error: any) {
      alert(error.message || 'Failed to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleReopen = async () => {
    if (!selectedComplaint) return;
    setReopenLoading(true);
    try {
      await fetchApi(`/complaints/${selectedComplaint.id}/reopen`, {
        method: 'PATCH',
      });
      setReopenSuccess(true);
      await loadData();
      // Update locally
      setSelectedComplaint({ ...selectedComplaint, status: 'Pending' });
    } catch (error: any) {
      alert(error.message || 'Failed to reopen complaint');
    } finally {
      setReopenLoading(false);
    }
  };

  const getIcon = (status: string) => {
    if (status === 'Resolved') return <CheckCircle size={20} className="text-gray-600" />;
    if (status === 'In Progress') return <AlertTriangle size={20} className="text-gray-600" />;
    if (status === 'Pending') return <Clock size={20} className="text-gray-600" />;
    return <Lightbulb size={20} className="text-gray-600" />;
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;
  }

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</h3>
                  <p className="font-medium text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{selectedComplaint.category || selectedComplaint.department || 'General'}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Priority</h3>
                  <span className={`inline-block font-semibold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider border ${
                    selectedComplaint.priority === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-200' :
                    selectedComplaint.priority === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                    selectedComplaint.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>

              {selectedComplaint.ai_summary && (
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                      🤖 AI Analysis Summary
                    </span>
                    {selectedComplaint.ai_confidence && (
                      <span className="text-[11px] text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-full font-medium">
                        {Math.round(selectedComplaint.ai_confidence * 100)}% Confidence
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-950 font-normal leading-relaxed mt-1">
                    {selectedComplaint.ai_summary}
                  </p>
                  {selectedComplaint.is_ai_overridden && (
                    <div className="mt-2 text-xs text-purple-700 bg-purple-50 p-2 rounded border border-purple-200">
                      <strong>Human Override:</strong> {selectedComplaint.override_reason || 'Department/Priority adjusted by officer.'}
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Original Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3.5 rounded-lg border border-gray-100">{selectedComplaint.description || 'No description provided.'}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <MapPin size={14} /> Location
                </h3>
                <p className="font-medium text-xs text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  {selectedComplaint.address || (selectedComplaint.lat ? `Lat: ${selectedComplaint.lat.toFixed(4)}, Lng: ${selectedComplaint.lng.toFixed(4)}` : 'Location not provided')}
                </p>
              </div>

              {selectedComplaint.status === 'Resolved' && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Feedback & Resolution</h3>
                  
                  {selectedComplaint.feedback && selectedComplaint.feedback.length > 0 ? (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={18} 
                            className={star <= selectedComplaint.feedback[0].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 italic">"{selectedComplaint.feedback[0].comments}"</p>
                    </div>
                  ) : feedbackSuccess ? (
                    <div className="bg-green-50 p-4 rounded-xl text-green-700 font-medium flex items-center gap-2">
                      <CheckCircle size={20} /> Thank you for your feedback!
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate Resolution</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRating(star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                size={24} 
                                className={star <= rating ? 'text-yellow-400 fill-yellow-400 hover:scale-110 transition-transform' : 'text-gray-300 hover:text-yellow-400 transition-colors'} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comments (Optional)</label>
                        <textarea 
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          rows={2}
                          placeholder="How did the department handle this issue?"
                        ></textarea>
                      </div>
                      <div className="flex justify-between items-center">
                        <button
                          type="submit"
                          disabled={feedbackLoading}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
                        >
                          {feedbackLoading ? <Loader2 className="animate-spin" size={16} /> : 'Submit Feedback'}
                        </button>

                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 mb-1">Not satisfied?</span>
                          <button
                            type="button"
                            onClick={handleReopen}
                            disabled={reopenLoading || reopenSuccess}
                            className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 disabled:opacity-50"
                          >
                            {reopenLoading ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />} 
                            {reopenSuccess ? 'Reopened' : 'Reopen Complaint'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
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
