import { LatLng } from 'leaflet'
export { LatLng }

export interface LatLngJSON {
    lat: number,
    lng: number,
}

export interface AltNamesJSON {
    [lang: string]: string,
}

export interface PlatformJSON {
    name: string,
    altNames: AltNamesJSON,
    location: LatLngJSON,
}

export interface TransferJSON {
    source: number,
    target: number,
}

export interface SpanJSON {
    source: number,
    target: number,
    routes: number[],
}

export interface LineJSON {
    name: {
        [lang: string]: string,
    },
}

export interface RouteJSON {
    line: string,
    branch: string,
}

export interface GraphJSON {
    platforms: PlatformJSON[],
    transfers: TransferJSON[],
    lines: {
        [lineId: string]: LineJSON,
    },
    spans: SpanJSON[],
    routes: RouteJSON[],
}

export interface AltNames {
    [lang: string]: string,
}
