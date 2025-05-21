import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
    userEmail: string | null;
}

export default function Navbar({ userEmail }: NavbarProps) {
    const router = useRouter();

    return (
        <nav className="bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-white">FlyTicket</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {userEmail && (
                            <span className="text-gray-300">
                                {userEmail}
                            </span>
                        )}
                        <button
                            onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 