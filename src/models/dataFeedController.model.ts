export interface DatafeedController {
    cid: number;
    name: string;
    callsign: string;
    frequency: string;
    facility: number;
    rating: number;
    server: string;
    visual_range: string;
    text_atis: string | null;
    last_updated: Date;
    logon_time: string;
}

type AtisType = string | null | void;
