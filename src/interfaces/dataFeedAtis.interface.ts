export interface DatafeedAtis {
    cid: number;
    name: string;
    callsign: string;
    frequency: string;
    facility: number;
    rating: number;
    server: string;
    visual_range: number;
    text_atis: string[] | undefined;
    last_updated: Date;
    logon_time: string;
    atis_code: string;
}
