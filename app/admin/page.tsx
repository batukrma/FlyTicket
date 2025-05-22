'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ManageFlight } from '@/components/adminComponents/ManageFlight';
import { ViewBookings } from '@/components/adminComponents/ViewBookings';

interface Flight {
    flight_id: string;
    from_city: string;
    to_city: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    seats_total: number;
    seats_available: number;
}

interface Booking {
    ticket_id: string;
    passenger_name: string;
    passenger_surname: string;
    passenger_email: string;
    seat_number: string | null;
    created_at: string;
    flight: {
        from_city: string;
        to_city: string;
        departure_time: string;
        arrival_time: string;
        price: number;
    };
}

interface NewFlightForm {
    from_city: string;
    to_city: string;
    departure_time: string;
    arrival_time: string;
    price: string;
    seats_total: string;
    seats_available: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'flights' | 'bookings'>('flights');
    const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
    const [newFlight, setNewFlight] = useState<NewFlightForm>({
        from_city: '',
        to_city: '',
        departure_time: '',
        arrival_time: '',
        price: '',
        seats_total: '',
        seats_available: ''
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !user.user_metadata?.isAdmin) {
                router.push('/');
            } else {
                fetchFlights();
                fetchBookings();
            }
        };
        checkUser();
    }, [router]);

    const fetchFlights = async () => {
        try {
            const { data, error } = await supabase
                .from('flight')
                .select('*')
                .order('departure_time', { ascending: true });

            if (error) throw error;
            setFlights(data || []);
        } catch (error: any) {
            console.error('Error fetching flights:', error);
            setError('Failed to fetch flights');
        }
    };

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('ticket')
                .select(`
                    *,
                    flight:flight_id (
                        from_city,
                        to_city,
                        departure_time,
                        arrival_time,
                        price
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            setError('Failed to fetch bookings');
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleAddFlight = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { data, error } = await supabase
                .from('flight')
                .insert([{
                    from_city: newFlight.from_city,
                    to_city: newFlight.to_city,
                    departure_time: newFlight.departure_time,
                    arrival_time: newFlight.arrival_time,
                    price: parseFloat(newFlight.price),
                    seats_total: parseInt(newFlight.seats_total),
                    seats_available: parseInt(newFlight.seats_available)
                }])
                .select()
                .single();

            if (error) throw error;

            setSuccess('Flight added successfully');
            setNewFlight({
                from_city: '',
                to_city: '',
                departure_time: '',
                arrival_time: '',
                price: '',
                seats_total: '',
                seats_available: ''
            });
            fetchFlights();
        } catch (error: any) {
            console.error('Error adding flight:', error);
            setError(error.message || 'Failed to add flight');
        } finally {
            setLoading(false);
        }
    };

    const handleEditFlight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFlight) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { error } = await supabase
                .from('flight')
                .update({
                    from_city: editingFlight.from_city,
                    to_city: editingFlight.to_city,
                    departure_time: editingFlight.departure_time,
                    arrival_time: editingFlight.arrival_time,
                    price: editingFlight.price,
                    seats_total: editingFlight.seats_total,
                    seats_available: editingFlight.seats_available
                })
                .eq('flight_id', editingFlight.flight_id);

            if (error) throw error;

            setSuccess('Flight updated successfully');
            setEditingFlight(null);
            fetchFlights();
        } catch (error: any) {
            console.error('Error updating flight:', error);
            setError(error.message || 'Failed to update flight');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFlight = async (flightId: string) => {
        if (!confirm('Are you sure you want to delete this flight?')) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { error } = await supabase
                .from('flight')
                .delete()
                .eq('flight_id', flightId);

            if (error) throw error;

            setSuccess('Flight deleted successfully');
            fetchFlights();
        } catch (error: any) {
            console.error('Error deleting flight:', error);
            setError(error.message || 'Failed to delete flight');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-black font-sans">FlyTicket Admin</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setActiveTab('flights')}
                            className={`px-4 py-2 rounded-md font-sans ${activeTab === 'flights'
                                ? 'bg-black text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Flight Management
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-4 py-2 rounded-md font-sans ${activeTab === 'bookings'
                                ? 'bg-black text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Booking Overview
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-800 rounded font-sans">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded font-sans">
                            {success}
                        </div>
                    )}

                    {activeTab === 'flights' && <ManageFlight onSuccess={() => { }} />}
                    {activeTab === 'bookings' && <ViewBookings />}
                </div>
            </main>

            {editingFlight && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-lg font-semibold mb-4 text-black font-sans">Edit Flight</h2>
                        <form onSubmit={handleEditFlight} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 font-sans">From City</label>
                                    <input
                                        type="text"
                                        value={editingFlight.from_city}
                                        onChange={(e) => setEditingFlight(prev => prev ? { ...prev, from_city: e.target.value } : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 font-sans">To City</label>
                                    <input
                                        type="text"
                                        value={editingFlight.to_city}
                                        onChange={(e) => setEditingFlight(prev => prev ? { ...prev, to_city: e.target.value } : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 font-sans">Departure Time</label>
                                    <input
                                        type="datetime-local"
                                        value={editingFlight.departure_time}
                                        onChange={(e) => setEditingFlight(prev => prev ? { ...prev, departure_time: e.target.value } : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 font-sans">Arrival Time</label>
                                    <input
                                        type="datetime-local"
                                        value={editingFlight.arrival_time}
                                        onChange={(e) => setEditingFlight(prev => prev ? { ...prev, arrival_time: e.target.value } : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 font-sans">Price</label>
                                    <input
                                        type="number"
                                        value={editingFlight.price}
                                        onChange={(e) => setEditingFlight(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 font-sans">Total Seats</label>
                                    <input
                                        type="number"
                                        value={editingFlight.seats_total}
                                        onChange={(e) => setEditingFlight(prev => prev ? { ...prev, seats_total: parseInt(e.target.value) } : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingFlight(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 font-sans"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 font-sans"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
} 