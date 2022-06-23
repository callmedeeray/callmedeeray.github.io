

export interface LocationRaw {
    jdtdb: string;
    calendar_date: string;
    x: string;
    y: string;
    z: string;
};


export interface Location {
    id: number;
    calendar_date: any;
    x: number;
    y: number;
    z: number;
};

export interface BodyLocations {
    [key: string]: Location[];
}
