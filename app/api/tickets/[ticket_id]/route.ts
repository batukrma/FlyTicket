import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { ticket_id: string } }) {
    const { ticket_id } = params;
    if (!ticket_id) {
        return NextResponse.json({ error: 'Missing ticket_id' }, { status: 400 });
    }
    // Fetch the ticket
    const { data: ticket, error: ticketError } = await supabase.from('Ticket').select('*').eq('ticket_id', ticket_id).single();
    if (ticketError || !ticket) {
        return NextResponse.json({ error: ticketError?.message || 'Ticket not found' }, { status: 404 });
    }
    // Fetch the related flight
    const { data: flight, error: flightError } = await supabase.from('Flight').select('*').eq('flight_id', ticket.flight_id).single();
    if (flightError || !flight) {
        return NextResponse.json({ error: flightError?.message || 'Flight not found' }, { status: 404 });
    }
    return NextResponse.json({ ...ticket, flight });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { ticket_id: string } }
) {
    try {
        const ticketId = params.ticket_id;

        // First get the ticket to check if it exists and get the flight_id
        const { data: ticket, error: ticketError } = await supabase
            .from('ticket')
            .select('flight_id')
            .eq('ticket_id', ticketId)
            .single();

        if (ticketError || !ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Get current flight data
        const { data: flight, error: flightError } = await supabase
            .from('flight')
            .select('seats_available')
            .eq('flight_id', ticket.flight_id)
            .single();

        if (flightError || !flight) {
            return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
        }

        // Start a transaction to delete ticket and update flight seats
        const { error: deleteError } = await supabase
            .from('ticket')
            .delete()
            .eq('ticket_id', ticketId);

        if (deleteError) {
            console.error('Error deleting ticket:', deleteError);
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        // Update available seats count
        const { error: updateError } = await supabase
            .from('flight')
            .update({ seats_available: flight.seats_available + 1 })
            .eq('flight_id', ticket.flight_id)
            .eq('seats_available', flight.seats_available); // Optimistic locking

        if (updateError) {
            console.error('Error updating seats:', updateError);
            // If seat update fails, we should recreate the ticket
            await supabase.from('ticket').insert([{
                ...ticket,
                created_at: new Date().toISOString()
            }]);
            return NextResponse.json({
                error: 'Failed to update seat count. Please try again.',
                details: updateError
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Ticket cancelled successfully',
            ticket_id: ticketId,
            seats_remaining: flight.seats_available + 1
        });
    } catch (err: any) {
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 