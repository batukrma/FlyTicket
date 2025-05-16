import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        overview: 'This API allows users to search for flights, book tickets, and view booking confirmations.',
        endpoints: [
            {
                name: 'List All Cities',
                method: 'GET',
                path: '/api/cities',
                response: [
                    { city_id: '01', city_name: 'Adana' },
                    // ...
                ],
            },
            {
                name: 'List/Search Flights',
                method: 'GET',
                path: '/api/flights',
                query: {
                    from_city: 'string (city_id)',
                    to_city: 'string (city_id)',
                    date: 'string (YYYY-MM-DD)',
                },
                example: '/api/flights?from_city=34&to_city=06&date=2024-06-10',
                response: [
                    {
                        flight_id: 'F123',
                        from_city: '34',
                        to_city: '06',
                        departure_time: '2024-06-10T09:00:00Z',
                        arrival_time: '2024-06-10T10:30:00Z',
                        price: 1200,
                        seats_total: 180,
                        seats_available: 42,
                    },
                ],
            },
            {
                name: 'Book a Ticket',
                method: 'POST',
                path: '/api/tickets',
                request: {
                    passenger_name: 'string',
                    passenger_surname: 'string',
                    passenger_email: 'string',
                    flight_id: 'string',
                    seat_number: 'string (optional)',
                },
                response: {
                    ticket_id: 'T9876',
                    passenger_name: 'Ahmet',
                    passenger_surname: 'Yılmaz',
                    passenger_email: 'ahmet@example.com',
                    flight_id: 'F123',
                    seat_number: '12A',
                },
            },
            {
                name: 'View Booking Confirmation',
                method: 'GET',
                path: '/api/tickets/{ticket_id}',
                response: {
                    ticket_id: 'T9876',
                    passenger_name: 'Ahmet',
                    passenger_surname: 'Yılmaz',
                    passenger_email: 'ahmet@example.com',
                    flight_id: 'F123',
                    seat_number: '12A',
                    flight: {
                        from_city: '34',
                        to_city: '06',
                        departure_time: '2024-06-10T09:00:00Z',
                        arrival_time: '2024-06-10T10:30:00Z',
                        price: 1200,
                    },
                },
            },
        ],
        fields: {
            city_id: 'String, unique city identifier (e.g., 34 for Istanbul)',
            city_name: 'String, name of the city',
            flight_id: 'String, unique flight identifier for each flight. Used in URLs and API requests to reference a specific flight. Must be unique (e.g., F123, IST-ANK-20240610-1000).',
            from_city: 'String, city_id reference (origin)',
            to_city: 'String, city_id reference (destination)',
            departure_time: 'ISO 8601 DateTime',
            arrival_time: 'ISO 8601 DateTime',
            price: 'Number, ticket price',
            seats_total: 'Number, total seats on the flight',
            seats_available: 'Number, available seats',
            ticket_id: 'String, unique ticket identifier for each booking',
            passenger_name: 'String',
            passenger_surname: 'String',
            passenger_email: 'String',
            seat_number: 'String, seat assignment (optional)',
        },
        notes: [
            'All times are in ISO 8601 format (UTC).',
            'Searching flights by date returns flights departing on that day.',
            'Booking a ticket decrements seats_available for the flight.',
            'flight_id is required for all flight-related API operations (fetching, booking, etc.).',
            'It is passed as a parameter in URLs (e.g., /api/flights?flight_id=F123) and in request bodies when booking tickets.',
            'It must be unique for each flight in your system. You can use a string, UUID, or a structured code (e.g., IST-ANK-20240610-1000).',
        ],
    });
} 