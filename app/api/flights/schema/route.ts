import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('flight')
            .select('*')
            .limit(1);

        if (error) throw error;

        // Get the column information from the first row
        const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

        return NextResponse.json({
            columns,
            types: {
                flight_id: 'string',
                from_city: 'string',
                to_city: 'string',
                departure_time: 'string',
                arrival_time: 'string',
                price: 'number',
                seats_total: 'number',
                seats_available: 'number'
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
