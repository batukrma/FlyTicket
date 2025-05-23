import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
    request: NextRequest,
    context: { params: { flight_id: string } }
) {
    try {
        const body = await request.json();
        const { from_city, to_city, departure_time, arrival_time, price, seats_total, seats_available } = body;

        const { data, error } = await supabase
            .from('flight')
            .update({
                from_city,
                to_city,
                departure_time,
                arrival_time,
                price: parseFloat(price),
                seats_total: parseInt(seats_total),
                seats_available: parseInt(seats_available)
            })
            .eq('flight_id', context.params.flight_id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { flight_id: string } }
) {
    try {
        const { error } = await supabase
            .from('flight')
            .delete()
            .eq('flight_id', params.flight_id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 