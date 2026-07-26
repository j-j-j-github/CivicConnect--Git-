import Link from 'next/link';
import { AlertTriangle, Lightbulb, Clock, CheckCircle } from 'lucide-react';

export default function ReportsPage() {
  const allComplaints = [
    { 
      id: '1', 
      title: 'Pothole on Main St', 
      date: 'Oct 12, 2023', 
      status: 'In Progress', 
      icon: <AlertTriangle size={20} className="text-gray-600" />,
      department: 'Public Works'
    },
    { 
      id: '2', 
      title: 'Broken Streetlight', 
      date: 'Oct 05, 2023', 
      status: 'Resolved', 
      icon: <Lightbulb size={20} className="text-gray-600" />,
      department: 'Electricity'
    },
    { 
      id: '3', 
      title: 'Water Leakage', 
      date: 'Sep 28, 2023', 
      status: 'Pending', 
      icon: <Clock size={20} className="text-gray-600" />,
      department: 'Water Authority'
    },
    { 
      id: '4', 
      title: 'Garbage Dump Overflow', 
      date: 'Sep 15, 2023', 
      status: 'Resolved', 
      icon: <CheckCircle size={20} className="text-gray-600" />,
      department: 'Municipality'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
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
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {c.icon}
                      </div>
                      <span className="font-bold text-gray-900">{c.title}</span>
                    </div>
                  </td>
                  <td className="p-5 text-gray-500 text-sm">{c.date}</td>
                  <td className="p-5 text-gray-500 text-sm">{c.department}</td>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
