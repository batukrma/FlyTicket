'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import React from 'react';

export default function User() {
    const router = useRouter();
    const [cities, setCities] = useState<any[]>([]);
    const [flights, setFlights] = useState<any[]>([]);
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [bookingFlightId, setBookingFlightId] = useState<string | null>(null);
    const [bookingForm, setBookingForm] = useState({
        passenger_name: '',
        passenger_surname: '',
        passenger_email: '',
        seat_number: ''
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/');
            }
        };
        checkUser();
    }, [router]);

    useEffect(() => {
        // Fetch cities on mount
        const fetchCities = async () => {
            const res = await fetch('/api/cities');
            const data = await res.json();
            console.log('Cities data:', data);
            setCities(data);
        };
        fetchCities();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearching(true);
        setHasSearched(true);

        const res = await fetch(`/api/flights?from_city=${fromCity}&to_city=${toCity}&date=${date}`);
        const data = await res.json();

        console.log('All flights:', data);

        setFlights(data);
        setSearching(false);
    };

    const handleBook = (flightId: string) => {
        setBookingFlightId(flightId);
        setBookingForm({ passenger_name: '', passenger_surname: '', passenger_email: '', seat_number: '' });
        setBookingError(null);
        setBookingSuccess(null);
    };

    const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBookingLoading(true);
        setBookingError(null);
        setBookingSuccess(null);
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...bookingForm, flight_id: bookingFlightId })
            });
            const data = await res.json();
            if (data.error) {
                setBookingError(data.error);
            } else {
                setBookingSuccess('Booking successful! Your ticket ID: ' + data.ticket_id);
                setBookingForm({ passenger_name: '', passenger_surname: '', passenger_email: '', seat_number: '' });
                setBookingFlightId(null);
            }
        } catch (err: any) {
            setBookingError('An error occurred while booking.');
        }
        setBookingLoading(false);
    };

    // Helper to get city name by id
    const getCityName = (id: string) => {
        const city = cities.find((c) => (c as any).city_id === id);
        return city ? (city as any).city_name : id;
    };

    return (
        <>
            <div className="min-h-screen bg-gray-900 text-gray-100">
                <nav className="bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold text-white">FlyTicket</h1>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
                                    className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-3xl mx-auto py-10 px-4">
                    <h2 className="text-3xl font-bold text-white mb-8">Search Flights</h2>
                    <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10" onSubmit={handleSearch}>
                        <select
                            className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={fromCity}
                            onChange={e => setFromCity(e.target.value)}
                            required
                        >
                            <option value="">From</option>
                            {cities.map((city: any) => (
                                <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={toCity}
                            onChange={e => setToCity(e.target.value)}
                            required
                        >
                            <option value="">To</option>
                            {cities.map((city: any) => (
                                <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            disabled={searching}
                        >
                            {searching ? 'Searching...' : 'Search'}
                        </button>
                    </form>

                    <h3 className="text-xl font-semibold text-white mb-4">Available Flights</h3>
                    {!hasSearched ? (
                        <p className="text-gray-400">Please search for flights above.</p>
                    ) : loading ? (
                        <p>Loading flights...</p>
                    ) : flights.length === 0 ? (
                        <div className="text-red-400 font-semibold">No flights found between the selected cities and date.</div>
                    ) : (
                        <div className="space-y-4">
                            {flights.map((flight: any) => (
                                <div key={flight.flight_id} className="border border-gray-700 bg-gray-800 rounded-lg p-4 mb-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="font-semibold text-lg text-white">{getCityName(flight.from_city)} → {getCityName(flight.to_city)}</div>
                                            <div className="text-gray-300 text-sm">Departure: {new Date(flight.departure_time).toLocaleString()}</div>
                                            <div className="text-gray-300 text-sm">Arrival: {new Date(flight.arrival_time).toLocaleString()}</div>
                                            <div className="text-gray-300 text-sm">Price: {flight.price}₺</div>
                                            <div className="text-gray-300 text-sm">Seats Available: {flight.seats_available}</div>
                                        </div>
                                        <button
                                            onClick={() => handleBook(flight.flight_id)}
                                            className="mt-4 md:mt-0 bg-blue-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                        >
                                            Book
                                        </button>
                                    </div>
                                    {bookingFlightId === flight.flight_id && (
                                        <form className="mt-4 space-y-2 bg-gray-900 p-4 rounded-lg" onSubmit={handleBookingSubmit}>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    name="passenger_name"
                                                    placeholder="Name"
                                                    required
                                                    className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={bookingForm.passenger_name}
                                                    onChange={handleBookingFormChange}
                                                />
                                                <input
                                                    type="text"
                                                    name="passenger_surname"
                                                    placeholder="Surname"
                                                    required
                                                    className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={bookingForm.passenger_surname}
                                                    onChange={handleBookingFormChange}
                                                />
                                            </div>
                                            <input
                                                type="email"
                                                name="passenger_email"
                                                placeholder="Email"
                                                required
                                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={bookingForm.passenger_email}
                                                onChange={handleBookingFormChange}
                                            />
                                            <input
                                                type="text"
                                                name="seat_number"
                                                placeholder="Seat Number (optional)"
                                                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={bookingForm.seat_number}
                                                onChange={handleBookingFormChange}
                                            />
                                            {bookingError && <div className="text-red-400 text-sm">{bookingError}</div>}
                                            {bookingSuccess && <div className="text-green-400 text-sm">{bookingSuccess}</div>}
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                    disabled={bookingLoading}
                                                >
                                                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bg-gray-700 text-white rounded-md px-4 py-2 font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                    onClick={() => setBookingFlightId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
