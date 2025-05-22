import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vwcvocipzvyntbtidgpu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Y3ZvY2lwenZ5bnRidGlkZ3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDY5MjgsImV4cCI6MjA2MjcyMjkyOH0.KFe-v9VrS942fB6eBPz0aHaecDkQ4JRGzATDJiVvUpo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    // Check flight table
    const { data: flights, error: flightError } = await supabase
        .from('flight')
        .select('*')
        .limit(1);

    console.log('Flight table structure:', flights?.[0]);
    if (flightError) console.error('Flight table error:', flightError);

    // Check ticket table
    const { data: tickets, error: ticketError } = await supabase
        .from('ticket')
        .select('*')
        .limit(1);

    console.log('Ticket table structure:', tickets?.[0]);
    if (ticketError) console.error('Ticket table error:', ticketError);
}

checkSchema(); 