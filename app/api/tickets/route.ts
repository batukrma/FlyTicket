import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('ticket')
            .select(`
                *,
                flight:flight_id (
                    from_city,
                    to_city,
                    departure_time,
                    arrival_time,
                    price
                )
            `)
            .eq('passenger_email', email)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tickets:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (err: any) {
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { passenger_name, passenger_surname, passenger_email, flight_id, seat_number } = body;

        // Validate required fields
        if (!passenger_name || !passenger_surname || !passenger_email || !flight_id) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: {
                    passenger_name: !passenger_name,
                    passenger_surname: !passenger_surname,
                    passenger_email: !passenger_email,
                    flight_id: !flight_id
                }
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(passenger_email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Start a transaction to check seats and create ticket
        const { data: flight, error: flightError } = await supabase
            .from('flight')
            .select('seats_available')
            .eq('flight_id', flight_id)
            .single();

        if (flightError || !flight) {
            return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
        }

        if (flight.seats_available <= 0) {
            return NextResponse.json({ error: 'No seats available for this flight' }, { status: 400 });
        }

        // Create ticket with current timestamp
        const { data: ticket, error: ticketError } = await supabase.from('ticket').insert([
            {
                passenger_name,
                passenger_surname,
                passenger_email,
                flight_id,
                seat_number: seat_number || null,
                created_at: new Date().toISOString()
            },
        ]).select().single();

        if (ticketError) {
            console.error('Ticket creation error:', ticketError);
            return NextResponse.json({ error: ticketError.message }, { status: 500 });
        }

        // Update available seats count
        const { error: updateError } = await supabase
            .from('flight')
            .update({ seats_available: flight.seats_available - 1 })
            .eq('flight_id', flight_id)
            .eq('seats_available', flight.seats_available); // Optimistic locking

        if (updateError) {
            console.error('Seat update error:', updateError);
            // If seat update fails, we should rollback the ticket creation
            await supabase.from('ticket').delete().eq('ticket_id', ticket.ticket_id);
            return NextResponse.json({
                error: 'Failed to update seat count. Please try again.',
                details: updateError
            }, { status: 500 });
        }

        return NextResponse.json({
            ticket_id: ticket.ticket_id,
            message: 'Ticket booked successfully',
            details: {
                ...ticket,
                seats_remaining: flight.seats_available - 1
            }
        });
    } catch (err: any) {
        console.error('Server error:', err);
        return NextResponse.json({
            error: 'Internal server error',
            message: err.message
        }, { status: 500 });
    }
} 