export interface vatsimEvent {
    id: number;
    type: string;
    vso_name: string;
    name: string;
    link: string;
    organisers: organizer[];
    airports: airport[];
    routes: route[];
    start_time: Date;
    end_time: Date;
    short_description: string;
    description: string;
    banner: string;

}

export interface organizer {
    region: string;
    division: string;
    subdivision: string;
    organised_by_vatsim: boolean;

}

export interface airport {
    icao: string;
}

export interface route {
    departure: string;
    arrival: string;
    route: string;
}