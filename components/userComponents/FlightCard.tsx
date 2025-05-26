import Image from 'next/image';

interface FlightCardProps {
    flight: any;
    cities: any[];
    onBook: (flightId: string) => void;
    getCityName: (id: string) => string;
}

export default function FlightCard({ flight, cities, onBook, getCityName }: FlightCardProps) {
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Image src="/assets/plane.png" alt="Plane" width={24} height={24} className="object-contain" />
                            <div className="font-semibold text-xl text-white">
                                {getCityName(flight.from_city)} → {getCityName(flight.to_city)}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-gray-300">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Departure</div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(flight.departure_time).toLocaleString()}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Arrival</div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(flight.arrival_time).toLocaleString()}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Price</div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-green-400 font-semibold">{flight.price}₺</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Available Seats</div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className={flight.seats_available > 5 ? 'text-green-400' : flight.seats_available > 0 ? 'text-yellow-400' : 'text-red-400'}>
                                        {flight.seats_available}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => onBook(flight.flight_id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 cursor-pointer flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
} 