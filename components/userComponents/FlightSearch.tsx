interface FlightSearchProps {
    cities: any[];
    searchParams: {
        from_city: string;
        to_city: string;
        departure_date: string;
    };
    onSearchParamsChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    onSearch: (e: React.FormEvent) => void;
}

export default function FlightSearch({
    cities,
    searchParams,
    onSearchParamsChange,
    onSearch
}: FlightSearchProps) {
    return (
        <form className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8" onSubmit={onSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label htmlFor="from_city" className="block text-sm font-medium text-gray-400">From</label>
                    <select
                        id="from_city"
                        name="from_city"
                        className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        value={searchParams.from_city}
                        onChange={onSearchParamsChange}
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map((city: any) => (
                            <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="to_city" className="block text-sm font-medium text-gray-400">To</label>
                    <select
                        id="to_city"
                        name="to_city"
                        className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        value={searchParams.to_city}
                        onChange={onSearchParamsChange}
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map((city: any) => (
                            <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="departure_date" className="block text-sm font-medium text-gray-400">Date</label>
                    <input
                        id="departure_date"
                        type="date"
                        name="departure_date"
                        className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        value={searchParams.departure_date}
                        onChange={onSearchParamsChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400 opacity-0">Search</label>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg"
                    >
                        Search Flights
                    </button>
                </div>
            </div>
        </form>
    );
} 