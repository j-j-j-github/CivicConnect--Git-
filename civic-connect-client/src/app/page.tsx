import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 lg:p-24 bg-gradient-to-b from-primary to-primary-dark text-white text-center">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
          Welcome to <span className="text-secondary">CivicConnect</span>
        </h1>
        <p className="text-lg lg:text-2xl text-blue-100 max-w-2xl mx-auto">
          Your AI-powered unified civic intelligence platform. Bridging the gap between citizens, officers, and administrators for a smarter city.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/auth/register" 
            className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-secondary-light text-white font-semibold rounded-lg shadow-lg transition-colors text-lg"
          >
            Join as Citizen
          </Link>
          <Link 
            href="/auth/login" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary hover:bg-gray-100 font-semibold rounded-lg shadow-lg transition-colors text-lg"
          >
            Login to Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
