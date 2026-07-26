'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      Cookies.set('token', data.access_token, { expires: 1, path: '/' });
      
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'OFFICER') {
        router.push('/officer/dashboard');
      } else {
        router.push('/citizen/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-4 font-sans py-12">
      <div className="w-full max-w-[420px] rounded-3xl bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center">
        
        {/* Custom Logo */}
        <div className="mb-4 relative">
          <svg width="64" height="80" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 0C16.536 0 4 12.536 4 28C4 49 32 80 32 80C32 80 60 49 60 28C60 12.536 47.464 0 32 0Z" fill="#042B6B"/>
            <rect x="20" y="16" width="24" height="18" rx="2" fill="white"/>
            <path d="M22 22H42V30H22V22Z" fill="#042B6B"/>
            <rect x="24" y="22" width="2" height="8" fill="white"/>
            <rect x="31" y="22" width="2" height="8" fill="white"/>
            <rect x="38" y="22" width="2" height="8" fill="white"/>
            <polygon points="32,18 22,22 42,22" fill="#042B6B"/>
          </svg>
        </div>

        {/* Headings */}
        <h2 className="text-3xl font-extrabold tracking-tight text-[#042B6B] mb-2">
          CivicConnect
        </h2>
        <p className="text-[#4b5563] text-sm font-medium mb-8">
          Smart Civic Governance at Your Fingertips.
        </p>

        {/* Form */}
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-center border border-red-100">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="citizen@example.com"
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#042B6B] focus:outline-none focus:ring-1 focus:ring-[#042B6B] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#042B6B] focus:outline-none focus:ring-1 focus:ring-[#042B6B] transition-colors pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Link href="#" className="text-sm font-bold text-[#042B6B] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#042B6B] px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#031d4a] focus:outline-none focus:ring-2 focus:ring-[#042B6B] focus:ring-offset-2 disabled:opacity-70 shadow-sm"
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
            </button>
          </div>
          
          <div className="pt-1">
             <Link 
              href="/auth/register"
              className="flex w-full items-center justify-center rounded-lg border-2 border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#042B6B] transition-colors hover:bg-gray-50 hover:border-[#d1d5db] focus:outline-none"
             >
               Create Citizen Account
             </Link>
          </div>
        </form>

        {/* Footer Pill */}
        <div className="mt-10 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-2 border-l-4 border-orange-500">
            <ShieldCheck size={16} className="text-orange-500" strokeWidth={2.5} />
            <span className="text-xs font-bold text-gray-600">Secure & Encrypted Civic Data</span>
          </div>
        </div>

      </div>
    </div>
  );
}
