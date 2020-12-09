export interface Session {
    $id: string;
    brand: string;
    current: boolean;
    device: number;
    ip: string;
    model: string;
    OS: OS;
    client: Client;
    geo: Geo
}

export interface OS {
    name: string;
    platform: string;
    short_name: string;
    version: string;
}

export interface Client {
    engine: string;
    name: string;
    short_name: string;
    type: string;
    version: string;
}

export interface Geo {
    country: string;
    isoCode: string;
}