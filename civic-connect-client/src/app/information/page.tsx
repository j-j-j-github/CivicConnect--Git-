import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function InformationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#042B6B] hover:underline font-bold mb-8">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[#042B6B] tracking-tight mb-6">General Information</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About CivicConnect</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            CivicConnect is an open-source, API-first e-governance platform. Our mission is to bridge the gap between citizens and local government by providing a transparent, efficient, and user-friendly interface for reporting and tracking civic issues.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            For technical support or inquiries, please reach out to our administration team at <a href="mailto:support@civicconnect.gov" className="text-[#042B6B] hover:underline font-semibold">support@civicconnect.gov</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
