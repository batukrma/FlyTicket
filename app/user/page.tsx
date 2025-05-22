'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/userComponents/Navbar';
import FlightSearch from '@/components/userComponents/FlightSearch';
import FlightCard from '@/components/userComponents/FlightCard';
import BookingForm from '@/components/userComponents/BookingForm';
import TicketCard from '@/components/userComponents/TicketCard';

export default function UserPage() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [cities, setCities] = useState<any[]>([]);
    const [flights, setFlights] = useState<any[]>([]);
    const [myTickets, setMyTickets] = useState<any[]>([]);
    const [showMyTickets, setShowMyTickets] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<any>(null);
    const [cancellingTicket, setCancellingTicket] = useState(false);

    const [searchParams, setSearchParams] = useState({
        from_city: '',
        to_city: '',
        departure_date: ''
    });

    const [form, setForm] = useState({
        passenger_name: '',
        passenger_surname: '',
        passenger_email: '',
        seat_number: ''
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUserEmail(user.email || null);
                fetchMyTickets(user.email || '');
            }
        };
        checkUser();
        fetchCities();
        fetchFlights();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await fetch('/api/cities');
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
            setError('Failed to load cities');
        }
    };

    const fetchFlights = async () => {
        try {
            const response = await fetch('/api/flights');
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setFlights(data);
        } catch (error) {
            console.error('Error fetching flights:', error);
            setError('Failed to load flights');
        }
    };

    const fetchMyTickets = async (email: string) => {
        try {
            const response = await fetch(`/api/tickets?email=${email}`);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setMyTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError('Failed to load tickets');
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const queryParams = new URLSearchParams();
            if (searchParams.from_city) queryParams.append('from_city', searchParams.from_city);
            if (searchParams.to_city) queryParams.append('to_city', searchParams.to_city);
            if (searchParams.departure_date) queryParams.append('departure_date', searchParams.departure_date);

            const response = await fetch(`/api/flights?${queryParams.toString()}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setFlights(data);
            setSuccess('Flights loaded successfully');
        } catch (error: any) {
            console.error('Error searching flights:', error);
            setError(error.message || 'Failed to search flights');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = (flightId: string) => {
        const flight = flights.find(f => f.flight_id === flightId);
        if (flight) {
            setSelectedFlight(flight);
            setForm(prev => ({
                ...prev,
                passenger_email: userEmail || ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...form,
                    flight_id: selectedFlight.flight_id
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setSuccess('Ticket booked successfully!');
            setSelectedFlight(null);
            setForm({
                passenger_name: '',
                passenger_surname: '',
                passenger_email: '',
                seat_number: ''
            });

            // Refresh flights and tickets
            fetchFlights();
            if (userEmail) {
                fetchMyTickets(userEmail);
            }
        } catch (error: any) {
            console.error('Error booking ticket:', error);
            setError(error.message || 'Failed to book ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelTicket = async (ticketId: string) => {
        if (!confirm('Are you sure you want to cancel this ticket?')) {
            return;
        }

        setCancellingTicket(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setSuccess('Ticket cancelled successfully!');
            setMyTickets(prev => prev.filter(ticket => ticket.ticket_id !== ticketId));

            // Refresh available flights
            fetchFlights();
        } catch (error: any) {
            console.error('Error cancelling ticket:', error);
            setError(error.message || 'Failed to cancel ticket');
        } finally {
            setCancellingTicket(false);
        }
    };

    const getCityName = (cityId: string) => {
        const city = cities.find(c => c.city_id === cityId);
        return city ? city.city_name : cityId;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar userEmail={userEmail} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">
                        {showMyTickets ? 'My Tickets' : 'Search Flights'}
                    </h1>
                    <button
                        onClick={() => {
                            setShowMyTickets(!showMyTickets);
                            if (!showMyTickets && userEmail) {
                                fetchMyTickets(userEmail);
                            }
                        }}
                        className="bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg"
                    >
                        {showMyTickets ? 'Search Flights' : 'My Tickets'}
                    </button>
                </div>

                {!showMyTickets ? (
                    <>
                        <FlightSearch
                            cities={cities}
                            searchParams={searchParams}
                            onSearchParamsChange={(e) => setSearchParams(prev => ({
                                ...prev,
                                [e.target.name]: e.target.value
                            }))}
                            onSearch={handleSearch}
                        />

                        {error && (
                            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-xl text-green-200">
                                {success}
                            </div>
                        )}

                        <div className="mt-8 space-y-4">
                            {flights.map(flight => (
                                <FlightCard
                                    key={flight.flight_id}
                                    flight={flight}
                                    cities={cities}
                                    onBook={handleBook}
                                    getCityName={getCityName}
                                />
                            ))}
                        </div>

                        {selectedFlight && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
                                    <h2 className="text-2xl font-bold mb-4">Book Flight</h2>
                                    <div className="text-gray-300 mb-6 space-y-2">
                                        <p>From: {getCityName(selectedFlight.from_city)}</p>
                                        <p>To: {getCityName(selectedFlight.to_city)}</p>
                                        <p>Departure: {new Date(selectedFlight.departure_time).toLocaleString()}</p>
                                        <p>Arrival: {new Date(selectedFlight.arrival_time).toLocaleString()}</p>
                                        <p>Price: {selectedFlight.price}₺</p>
                                        <p>Available Seats: {selectedFlight.available_seats}</p>
                                    </div>
                                    <BookingForm
                                        form={form}
                                        loading={loading}
                                        error={error}
                                        success={success}
                                        onChange={(e) => setForm(prev => ({
                                            ...prev,
                                            [e.target.name]: e.target.value
                                        }))}
                                        onSubmit={handleSubmit}
                                        onCancel={() => setSelectedFlight(null)}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-4">
                        {myTickets.map(ticket => (
                            <TicketCard
                                key={ticket.ticket_id}
                                ticket={ticket}
                                getCityName={getCityName}
                                onCancel={handleCancelTicket}
                                isCancelling={cancellingTicket}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
