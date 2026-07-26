import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#042B6B] hover:underline font-bold mb-8">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[#042B6B] tracking-tight mb-6">Our Services</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-lg text-gray-600 leading-relaxed">
            CivicConnect offers a wide range of services designed to make civic engagement effortless. From reporting infrastructural issues like potholes and broken streetlights to requesting waste management services and applying for civic permits, our platform is your one-stop solution for community maintenance. 
            <br/><br/>
            Create an account to unlock full access to our service catalogue and start tracking your requests in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
