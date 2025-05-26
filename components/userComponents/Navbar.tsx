import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
    userEmail: string | null;
}

export default function Navbar({ userEmail }: NavbarProps) {
    const router = useRouter();

    return (
        <nav className="backdrop-blur-md bg-gray-800/70 shadow-lg rounded-b-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    <div className="flex-1 flex items-center">
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm select-none">FlyTicket</h1>
                    </div>
                    <div className="flex-1 flex justify-end items-center space-x-4">
                        {userEmail && (
                            <span className="text-gray-200 font-medium px-3 py-1 rounded-lg bg-gray-700/60">{userEmail}</span>
                        )}
                        <button
                            onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg px-3 py-1.5 font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 cursor-pointer text-sm"
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-1V5m0 0V4" />
                            </svg>
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 