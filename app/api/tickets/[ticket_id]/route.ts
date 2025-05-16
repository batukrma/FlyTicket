import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

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