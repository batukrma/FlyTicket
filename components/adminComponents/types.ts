export interface Flight {
    flight_id: string;
    from_city: {
        city_name: string;
    };
    to_city: {
        city_name: string;
    };
    departure_time: string;
    arrival_time: string;
    price: number;
    seats_total: number;
    seats_available: number;
}

export interface Booking {
    ticket_id: string;
    passenger_name: string;
    passenger_surname: string;
    passenger_email: string;
    seat_number: string | null;
    created_at: string;
    flight: {
        from_city: {
            city_name: string;
        };
        to_city: {
            city_name: string;
        };
        departure_time: string;
        arrival_time: string;
        price: number;
    };
}

export interface NewFlightForm {
    from_city: string;
    to_city: string;
    departure_time: string;
    arrival_time: string;
    price: string;
    seats_total: string;
    seats_available: string;
} 