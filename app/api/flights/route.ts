import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const fromCity = searchParams.get('from_city');
        const toCity = searchParams.get('to_city');
        const date = searchParams.get('date');

        let query = supabase.from('flight').select('*');

        // Add city filters if provided
        if (fromCity) {
            query = query.eq('from_city', fromCity);
        }
        if (toCity) {
            query = query.eq('to_city', toCity);
        }

        // Add date filter if provided
        if (date) {
            // Create start and end of the selected date
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            // Filter flights that depart on the selected date
            query = query
                .gte('departure_time', startDate.toISOString())
                .lte('departure_time', endDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase Error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (e: any) {
        console.error('Server Error:', e);
        return NextResponse.json({ error: 'Internal Server Error', message: e.message }, { status: 500 });
    }
}
