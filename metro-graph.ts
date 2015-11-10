'use strict';
/// <reference path="./typings/tsd.d.ts" />
import L = require('leaflet');
import * as util from './util';
import * as po from './plain-objects';
import * as geo from './geo';

export type AltNames = { old?: string } | any;
    
export class Platform {
    private _name: string; // overrides the parent station's name
    private _altNames: AltNames;
    private _station: Station;
    private _spans: Span[];
    location: L.LatLng;

    constructor(location: L.LatLng, name: string = null, altNames: AltNames = null) {
        this._name = name;
        this._altNames = altNames;
        this.location = location;
        this._spans = [];
    }

    get name(): string {
        return this._name || this._station.name;
    }

    set name(name: string) {
        this._name = name;
    }

    get altNames(): AltNames {
        return this._altNames || this._station.altNames;
    }

    set altNames(names: AltNames) {
        this._altNames = names;
    }

    get spans(): Span[] {
        return this._spans;
    }

    get station(): Station {
        return this._station;
    }

    set station(station: Station) {
        if (this._station) {
            let stationPlatforms = this._station.platforms;
            stationPlatforms.splice(stationPlatforms.indexOf(this), 1);
        }
        if (station.platforms.indexOf(this) < 0) {
            station.platforms.push(this);
        }
        this._station = station;
    }
    
    isAdjacentTo(platform: Platform): boolean {
        return this.nextStops().indexOf(platform) > -1
    }

    nextStop(connector: Span): Platform {
        return connector.other(this);
    }
    
    nextStops(): Platform[] {
        return this._spans.map(span => span.other(this));
    }

    passingRoutes(): Route[] {
        const s = [];
        this._spans.forEach(span => span.routes.forEach(line => s.push(line)));
        return s;
    }

    passingLines(): Line[] {
        const s = [];
        this._spans.forEach(span => span.routes.forEach(route => s.push(route.line)));
        return s;
    }

}

export class Station {
    name: string;
    altNames: AltNames;
    platforms: Platform[];

    constructor(name: string, altNames: AltNames, platforms: Platform[] = []) {
        this.name = name;
        this.altNames = altNames;
        this.platforms = platforms;
        platforms.forEach(platform => platform.station = this);
    }

    get location(): L.LatLng {
        return geo.getCenter(this.platforms.map(platform => platform.location));
    }

}

class Edge {
    protected src: Platform;
    protected trg: Platform;
    bidirectional: boolean;

    constructor(source: Platform, target: Platform, bidirectional = true) {
        if (source === target) {
            throw new Error(`source & target cannot be the same platform (${source.name}, ${source.location})`);
        }
        this.src = source;
        this.trg = target;
        this.bidirectional = bidirectional;
    }

    get source(): Platform {
        return this.src;
    }

    get target(): Platform {
        return this.trg;
    }

    other(platform: Platform): Platform {
        if (this.src === platform) return this.trg;
        else if (this.trg === platform) return this.src;
        //console.log("span doesn't contain the specified platform");
        return null;
    }

    replacePlatform(old: Platform, replacement: Platform): void {
        if (this.src === old) this.src = replacement;
        else if (this.trg === old) this.trg = replacement;
        else throw new Error("edge doesn't contain the platform to replace");
    }
    
    addPlaform(platform: Platform): void {
        if (this.source) this.trg = platform;
        else if (!this.trg) this.trg = platform;
        else throw new Error("span cannot be triple-end");
    }

}

export class Span extends Edge {
    routes: Route[];

    constructor(source: Platform, target: Platform, routes: Route[], bidirectional = true) {
        super(source, target, bidirectional);
        source.spans.push(this);
        target.spans.push(this);
        this.routes = routes;
        this.bidirectional = bidirectional;
    }

    replacePlatform(old: Platform, replacement: Platform): void {
        super.replacePlatform(old, replacement);
        old.spans.splice(old.spans.indexOf(this), 1);
        replacement.spans.push(this);
    }

    addPlatform(platform: Platform): void {
        platform.spans.push(this);
        super.addPlaform(platform);
    }

}

export class Transfer extends Edge {
    constructor(source: Platform, target: Platform, bidirectional: boolean = true) {
        super(source, target, bidirectional);
    }
}

export class Line {
    type: string;
    num: number;
    name: string;

    constructor(type: string, num?: number, name: string = null) {
        if (['M', 'E', 'L'].indexOf(type) < 0) {
            throw new Error("type must be one letter");
        }
        this.type = type;
        if (num && num.toString() !== num.toPrecision()) {
            throw new Error(`line number ${num} cannot be fractional`);
        }
        this.num = num;
        this.name = name;
    }

    get id(): string {
        return this.type + (this.num || '');
    }


}

export class Route {
    line: Line;
    branch: string;

    constructor(line: Line, branch: string = '') {
        this.line = line;
        this.branch = branch;
    }

    get id(): string {
        return this.line.id + this.branch;
    }


    isParentOf(route: Route): boolean {
        if (this.line !== route.line) return false;
        const thisBranchSorted = this.branch.split('').sort().join(''),
            thatBranchSorted = route.branch.split('').sort().join('');
        return thisBranchSorted !== thatBranchSorted && thisBranchSorted.indexOf(thatBranchSorted) > -1;
    }

}

export class MetroGraph {
    platforms: Platform[] = [];
    spans: Span[] = [];
    stations: Station[] = [];
    lines: Line[] = [];
    transfers: Transfer[] = [];
    routes: Route[] = [];
    
    constructor(json?: string) {
        if (!json) return;
        let obj: po.Graph = JSON.parse(json);
        this.platforms = obj.platforms.map(p => new Platform(p.location, p.name, p.altNames));
        this.stations = obj.stations.map(s => new Station(s.name, s.altNames, s.platforms.map(i => this.platforms[i])));
        this.lines = Object.keys(obj.lines).map(l => {
            const matches = l.match(/([ML])(\d{1,2})/);
            return matches ? new Line(matches[1], parseInt(matches[2]), obj.lines[l]) : new Line('E');
        });
        this.routes = obj.routes.map(r => new Route(this.lines.find(l => l.id === r.line), r.branch));
        this.spans = obj.spans.map(s => new Span(this.platforms[s.source], this.platforms[s.target], s.routes.map(pr => this.routes[pr])));
        this.transfers = obj.transfers.map(t => new Transfer(this.platforms[t.source], this.platforms[t.target]));
    }

    toJSON(): string {
        let obj = {
            platforms: this.platforms.map(platform => ({
                name: platform.name,
                altNames: platform.altNames,
                station: this.stations.indexOf(platform.station),
                location: {
                    lat: platform.location.lat,
                    lng: platform.location.lng
                },
                spans: platform.spans.map(span => this.spans.indexOf(span)),
                transfers: this.transfers.map(transfer => transfer.other(platform))
                    .filter(o => o !== null)
                    .map(other => this.platforms.indexOf(other))
            })),
            transfers: this.transfers.map(transfer => ({
                source: this.platforms.indexOf(transfer.source),
                target: this.platforms.indexOf(transfer.target)
            })),
            stations: this.stations.map(station => ({
                name: station.name,
                altNames: station.altNames,
                location: {
                    lat: station.location.lat,
                    lng: station.location.lng
                },
                platforms: station.platforms.map(platform => this.platforms.indexOf(platform))
            })),
            lines: {},
            spans: this.spans.map(span => ({
                source: this.platforms.indexOf(span.source),
                target: this.platforms.indexOf(span.target),
                routes: span.routes.map(route => this.routes.indexOf(route))
            })),
            routes: this.routes.map(route => ({
                line: route.line.id,
                branch: route.branch
            }))

        };

        this.lines.forEach(line => obj.lines[line.id] = line.name);

        return JSON.stringify(obj);
    }

}//