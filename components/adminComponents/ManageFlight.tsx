import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Flight, NewFlightForm } from './types';

interface City {
    city_id: string;
    city_name: string;
}

interface ManageFlightProps {
    onSuccess: () => void;
}

export function ManageFlight({ onSuccess }: ManageFlightProps) {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
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
        fetchFlights();
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const { data, error } = await supabase
                .from('city')
                .select('*')
                .order('city_name', { ascending: true });

            if (error) throw error;
            setCities(data || []);
        } catch (error: any) {
            console.error('Error fetching cities:', error);
            setError('Failed to fetch cities');
        }
    };

    const fetchFlights = async () => {
        try {
            const { data, error } = await supabase
                .from('flight')
                .select(`
                    *,
                    from_city:city!flight_from_city_fkey(city_name),
                    to_city:city!flight_to_city_fkey(city_name)
                `)
                .order('departure_time', { ascending: true });

            if (error) throw error;
            setFlights(data || []);
        } catch (error: any) {
            console.error('Error fetching flights:', error);
            setError('Failed to fetch flights');
        }
    };

    const handleAddFlight = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/flights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from_city: newFlight.from_city,
                    to_city: newFlight.to_city,
                    departure_time: newFlight.departure_time,
                    arrival_time: newFlight.arrival_time,
                    price: newFlight.price,
                    seats_total: newFlight.seats_total
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add flight');
            }

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
            onSuccess();
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
            const fromCity = cities.find(city => city.city_name === editingFlight.from_city.city_name);
            const toCity = cities.find(city => city.city_name === editingFlight.to_city.city_name);

            if (!fromCity || !toCity) {
                throw new Error('Invalid city selection');
            }

            const response = await fetch(`/api/flights/${editingFlight.flight_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from_city: fromCity.city_id,
                    to_city: toCity.city_id,
                    departure_time: editingFlight.departure_time,
                    arrival_time: editingFlight.arrival_time,
                    price: editingFlight.price,
                    seats_total: editingFlight.seats_total,
                    seats_available: editingFlight.seats_available
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update flight');
            }

            setSuccess('Flight updated successfully');
            setEditingFlight(null);
            fetchFlights();
            onSuccess();
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
            const response = await fetch(`/api/flights/${flightId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete flight');
            }

            setSuccess('Flight deleted successfully');
            fetchFlights();
            onSuccess();
        } catch (error: any) {
            console.error('Error deleting flight:', error);
            setError(error.message || 'Failed to delete flight');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
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

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-black font-sans">Add New Flight</h2>
                <form onSubmit={handleAddFlight} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 font-sans">From City</label>
                            <select
                                value={newFlight.from_city}
                                onChange={(e) => setNewFlight(prev => ({ ...prev, from_city: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                required
                            >
                                <option value="">Select a city</option>
                                {cities.map((city) => (
                                    <option key={city.city_id} value={city.city_id}>
                                        {city.city_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 font-sans">To City</label>
                            <select
                                value={newFlight.to_city}
                                onChange={(e) => setNewFlight(prev => ({ ...prev, to_city: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                required
                            >
                                <option value="">Select a city</option>
                                {cities.map((city) => (
                                    <option key={city.city_id} value={city.city_id}>
                                        {city.city_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 font-sans">Departure Time</label>
                            <input
                                type="datetime-local"
                                value={newFlight.departure_time}
                                onChange={(e) => setNewFlight(prev => ({ ...prev, departure_time: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 font-sans">Arrival Time</label>
                            <input
                                type="datetime-local"
                                value={newFlight.arrival_time}
                                onChange={(e) => setNewFlight(prev => ({ ...prev, arrival_time: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 font-sans">Price</label>
                            <input
                                type="number"
                                value={newFlight.price}
                                onChange={(e) => setNewFlight(prev => ({ ...prev, price: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 font-sans">Total Seats</label>
                            <input
                                type="number"
                                value={newFlight.seats_total}
                                onChange={(e) => setNewFlight(prev => ({ ...prev, seats_total: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 font-sans"
                    >
                        {loading ? 'Adding...' : 'Add Flight'}
                    </button>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-black font-sans">Manage Flights</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">From</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Departure</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Arrival</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Seats</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-sans">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {flights.map((flight) => (
                                <tr key={flight.flight_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                        {flight.from_city.city_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                        {flight.to_city.city_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                        {new Date(flight.departure_time).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                        {new Date(flight.arrival_time).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">{flight.price}₺</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-sans">
                                        {flight.seats_available}/{flight.seats_total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => setEditingFlight(flight)}
                                            className="text-black hover:text-gray-700 mr-4 font-sans"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFlight(flight.flight_id)}
                                            className="text-red-600 hover:text-red-800 font-sans"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingFlight && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-lg font-semibold mb-4 text-black font-sans">Edit Flight</h2>
                        <form onSubmit={handleEditFlight} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 font-sans">From City</label>
                                    <select
                                        value={editingFlight.from_city.city_name}
                                        onChange={(e) => {
                                            const selectedCity = cities.find(city => city.city_name === e.target.value);
                                            setEditingFlight(prev => prev ? { ...prev, from_city: { city_name: selectedCity?.city_name || '' } } : null);
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                        required
                                    >
                                        <option value="">Select a city</option>
                                        {cities.map((city) => (
                                            <option key={city.city_id} value={city.city_name}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 font-sans">To City</label>
                                    <select
                                        value={editingFlight.to_city.city_name}
                                        onChange={(e) => {
                                            const selectedCity = cities.find(city => city.city_name === e.target.value);
                                            setEditingFlight(prev => prev ? { ...prev, to_city: { city_name: selectedCity?.city_name || '' } } : null);
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-gray-900 font-sans"
                                        required
                                    >
                                        <option value="">Select a city</option>
                                        {cities.map((city) => (
                                            <option key={city.city_id} value={city.city_name}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                    </select>
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
        </div>
    );
} 