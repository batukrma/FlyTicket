import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { passenger_name, passenger_surname, passenger_email, flight_id, seat_number } = body;
        if (!passenger_name || !passenger_surname || !passenger_email || !flight_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const { data, error } = await supabase.from('Ticket').insert([
            {
                passenger_name,
                passenger_surname,
                passenger_email,
                flight_id,
                seat_number: seat_number || null,
            },
        ]).select().single();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 });
    }
} 