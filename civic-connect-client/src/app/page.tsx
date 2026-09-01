import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-grow flex flex-col min-h-screen bg-white font-sans">
      {/* Top Header Bar */}
      <div className="bg-[#042B6B] text-white py-2 px-6 flex justify-between items-center text-xs tracking-wider font-semibold">
        <div className="flex items-center gap-4">
          <span>CIVICCONNECT OFFICIAL PLATFORM</span>
        </div>
        <div className="hidden sm:flex gap-6">
          <Link href="#" className="hover:text-blue-200 transition-colors">Contact Us</Link>
          <Link href="#" className="hover:text-blue-200 transition-colors">Language: EN</Link>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white py-5 px-8 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Custom Pin Logo */}
          <div className="w-10 h-12 flex items-center justify-center">
            <svg width="40" height="50" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 0C16.536 0 4 12.536 4 28C4 49 32 80 32 80C32 80 60 49 60 28C60 12.536 47.464 0 32 0Z" fill="#042B6B"/>
              <rect x="20" y="16" width="24" height="18" rx="2" fill="white"/>
              <path d="M22 22H42V30H22V22Z" fill="#042B6B"/>
              <rect x="24" y="22" width="2" height="8" fill="white"/>
              <rect x="31" y="22" width="2" height="8" fill="white"/>
              <rect x="38" y="22" width="2" height="8" fill="white"/>
              <polygon points="32,18 22,22 42,22" fill="#042B6B"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#042B6B] tracking-tight">CivicConnect</h1>
          </div>
        </div>
        <nav className="hidden md:flex gap-10 text-gray-600 font-bold text-sm">
          <Link href="/services" className="hover:text-[#042B6B] transition-colors border-b-2 border-transparent hover:border-[#042B6B] pb-1">Services</Link>
          <Link href="/departments" className="hover:text-[#042B6B] transition-colors border-b-2 border-transparent hover:border-[#042B6B] pb-1">Departments</Link>
          <Link href="/information" className="hover:text-[#042B6B] transition-colors border-b-2 border-transparent hover:border-[#042B6B] pb-1">Information</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 text-center bg-gray-50/50">
        <div className="max-w-4xl w-full space-y-8">
          <h2 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Empowering Citizens for a <span className="text-[#042B6B]">Smarter City</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Welcome to the unified civic intelligence platform. Seamlessly report issues, track resolutions, and collaborate with municipal departments to improve our community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Link 
              href="/auth/register" 
              className="w-full sm:w-auto px-8 py-4 bg-[#042B6B] hover:bg-[#031d4a] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all text-lg border border-transparent"
            >
              Register as Citizen
            </Link>
            <Link 
              href="/auth/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#042B6B] border-2 border-[#042B6B] hover:bg-gray-50 font-bold rounded-xl shadow-sm transition-all text-lg"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 text-gray-500 py-10 text-center text-sm font-medium">
        <p>&copy; {new Date().getFullYear()} CivicConnect Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
