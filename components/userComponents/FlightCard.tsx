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
                        <div className="flex items-center gap-2">
                            <div className="font-semibold text-xl text-white">
                                {getCityName(flight.from_city)} → {getCityName(flight.to_city)}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-gray-300">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Departure</div>
                                <div>{new Date(flight.departure_time).toLocaleString()}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Arrival</div>
                                <div>{new Date(flight.arrival_time).toLocaleString()}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Price</div>
                                <div className="text-green-400 font-semibold">{flight.price}₺</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Available Seats</div>
                                <div className={flight.seats_available > 5 ? 'text-green-400' : flight.seats_available > 0 ? 'text-yellow-400' : 'text-red-400'}>
                                    {flight.seats_available}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => onBook(flight.flight_id)}
                        className="bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
} 