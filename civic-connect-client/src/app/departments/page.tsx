'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import Cookies from 'js-cookie';

interface Department {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    complaints: number;
    officers: number;
  };
}

const defaultDepartments: Department[] = [
  {
    id: 'default-pwd',
    name: 'Public Works (PWD)',
    description: 'Handles road maintenance, potholes, and public infrastructure development.',
    _count: { complaints: 14, officers: 3 }
  },
  {
    id: 'default-water',
    name: 'Water Authority',
    description: 'Manages water supply, pipe leakages, and sewage line clearing.',
    _count: { complaints: 8, officers: 2 }
  },
  {
    id: 'default-electricity',
    name: 'Electricity Board',
    description: 'Responsible for streetlights, power outages, and electrical hazards.',
    _count: { complaints: 11, officers: 4 }
  },
  {
    id: 'default-health',
    name: 'Health & Sanitation',
    description: 'Oversees waste collection, public hygiene, and pest control.',
    _count: { complaints: 6, officers: 2 }
  },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const token = Cookies.get('token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('http://localhost:3001/api/v1/departments', {
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setDepartments(data);
          } else {
            setDepartments(defaultDepartments);
          }
        } else {
          setDepartments(defaultDepartments);
        }
      } catch (err) {
        setDepartments(defaultDepartments);
      } finally {
        setLoading(false);
      }
    }

    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#042B6B] hover:underline font-bold mb-8 transition-all hover:-translate-x-1">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-[#042B6B] tracking-tight">City Departments</h1>
            <p className="text-gray-500 mt-2">Connecting you to municipal services for rapid grievance resolution.</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#042B6B] rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
            <Building2 size={24} />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {departments.map((dept) => (
              <div 
                key={dept.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{dept.description || 'No description provided.'}</p>
                </div>
                
                {dept._count && (
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>{dept._count.complaints} Active Reports</span>
                    <span>{dept._count.officers} Officers Assigned</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
