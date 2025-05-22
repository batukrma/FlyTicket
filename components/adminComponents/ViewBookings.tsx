import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Booking } from './types';

export function ViewBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('ticket')
                .select(`
                    *,
                    flight:flight_id (
                        from_city:city!flight_from_city_fkey(city_name),
                        to_city:city!flight_to_city_fkey(city_name),
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
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600 font-sans">Loading bookings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-800 rounded font-sans">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-black font-sans">Booking Overview</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Passenger</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Flight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Departure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Seat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Booked At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                            <tr key={booking.ticket_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                    {booking.passenger_name} {booking.passenger_surname}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">{booking.passenger_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                    {booking.flight.from_city.city_name} → {booking.flight.to_city.city_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                    {new Date(booking.flight.departure_time).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">{booking.seat_number || 'Not assigned'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                    {new Date(booking.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 