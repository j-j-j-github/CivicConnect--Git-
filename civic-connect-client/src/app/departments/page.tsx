import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#042B6B] hover:underline font-bold mb-8">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[#042B6B] tracking-tight mb-6">City Departments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Public Works (PWD)</h3>
            <p className="text-gray-600">Handles road maintenance, potholes, and public infrastructure development.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Water Authority</h3>
            <p className="text-gray-600">Manages water supply, pipe leakages, and sewage line clearing.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Electricity Board</h3>
            <p className="text-gray-600">Responsible for streetlights, power outages, and electrical hazards.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Health & Sanitation</h3>
            <p className="text-gray-600">Oversees waste collection, public hygiene, and pest control.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
