export interface VatsimEvent {
    id: number;
    type: string;
    vso_name: string;
    name: string;
    link: string;
    organisers: VatsimEventOrganizer[];
    airports: VatsimEventAirport[];
    routes: VatsimEventRoute[];
    start_time: Date;
    end_time: Date;
    short_description: string;
    description: string;
    banner: string;

}

export interface VatsimEventOrganizer {
    region: string;
    division: string;
    subdivision: string;
    organised_by_vatsim: boolean;

}

export interface VatsimEventAirport {
    icao: string;
}

export interface VatsimEventRoute {
    departure: string;
    arrival: string;
    route: string;
}