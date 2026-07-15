'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          full_name: fullName, 
          role: 'CITIZEN' 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to register');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1E3A8A]">
            Join CivicConnect
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create an account to start reporting issues.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-[#1E3A8A] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#152c6b] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
