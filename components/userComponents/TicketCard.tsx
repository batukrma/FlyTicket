interface TicketCardProps {
    ticket: any;
    getCityName: (id: string) => string;
    onCancel: (ticketId: string) => void;
    isCancelling: boolean;
}

export default function TicketCard({ ticket, getCityName, onCancel, isCancelling }: TicketCardProps) {
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold text-xl text-white">
                                {getCityName(ticket.flight.from_city)} → {getCityName(ticket.flight.to_city)}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-gray-300">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Passenger</div>
                                <div>{ticket.passenger_name} {ticket.passenger_surname}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Email</div>
                                <div>{ticket.passenger_email}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Departure</div>
                                <div>{new Date(ticket.flight.departure_time).toLocaleString()}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Arrival</div>
                                <div>{new Date(ticket.flight.arrival_time).toLocaleString()}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-400">Price</div>
                                <div className="text-green-400 font-semibold">{ticket.flight.price}₺</div>
                            </div>
                            {ticket.seat_number && (
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-400">Seat</div>
                                    <div>{ticket.seat_number}</div>
                                </div>
                            )}

                        </div>
                    </div>
                    <button
                        onClick={() => onCancel(ticket.ticket_id)}
                        disabled={isCancelling}
                        className="bg-red-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCancelling ? 'Cancelling...' : 'Cancel Ticket'}
                    </button>
                </div>
            </div>
        </div>
    );
} 