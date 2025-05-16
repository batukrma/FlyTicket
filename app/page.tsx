'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import SignUpForm from '@/components/SignUpForm';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.user_metadata?.isAdmin === true) {
            router.push('/admin');
          } else {
            router.push('/user');
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.isAdmin === true) {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-2/4 relative">
        <img
          src="/assets/fly.jpg"
          alt="Airplane"
          className="absolute inset-0 w-full h-full object-cover"
        />

      </div>

      {/* Sağ taraf - Formlar */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              FlyTicket
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your trusted travel companion
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4" role="alert">
              {error}
            </div>
          )}

          {/* Login Form */}
          {!showSignUp && (
            <>
              <div className="bg-white p-8 rounded-lg ">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Login</h3>
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-150 cursor-pointer"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : 'Login'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="mt-2 flex justify-center items-center gap-2">
                <span className="text-sm text-gray-500">Don't have an account?</span>
                <button
                  onClick={() => { setShowSignUp(true); setError(null); }}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm cursor-pointer focus:outline-none"
                >
                  Create Account
                </button>
              </div>
            </>
          )}

          {/* Sign Up Form */}
          {showSignUp && (
            <div className="bg-white p-8 rounded-lg ">
              <SignUpForm />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowSignUp(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
