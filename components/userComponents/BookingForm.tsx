interface BookingFormProps {
    form: {
        passenger_name: string;
        passenger_surname: string;
        passenger_email: string;
        seat_number: string;
    };
    loading: boolean;
    error: string | null;
    success: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function BookingForm({
    form,
    loading,
    error,
    success,
    onChange,
    onSubmit,
    onCancel
}: BookingFormProps) {
    return (
        <form className="mt-4 space-y-2 bg-gray-900 p-4 rounded-lg" onSubmit={onSubmit}>
            <div className="flex gap-2">
                <input
                    type="text"
                    name="passenger_name"
                    placeholder="Name"
                    required
                    className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.passenger_name}
                    onChange={onChange}
                />
                <input
                    type="text"
                    name="passenger_surname"
                    placeholder="Surname"
                    required
                    className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.passenger_surname}
                    onChange={onChange}
                />
            </div>
            <input
                type="email"
                name="passenger_email"
                placeholder="Email"
                required
                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.passenger_email}
                onChange={onChange}
            />
            <input
                type="text"
                name="seat_number"
                placeholder="Seat Number (optional)"
                className="border border-gray-700 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.seat_number}
                onChange={onChange}
            />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            {success && <div className="text-green-400 text-sm">{success}</div>}
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl px-4 py-2 font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button
                    type="button"
                    className="flex items-center gap-1 border border-gray-500 text-gray-300 rounded-lg px-3 py-1.5 font-medium hover:bg-gray-800/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 cursor-pointer text-sm"
                    onClick={onCancel}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                </button>
            </div>
        </form>
    );
} 