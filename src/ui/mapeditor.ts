/// <reference path="../../typings/tsd.d.ts" />
import MetroMap from '../metromap';
import * as svg from '../svg';
import { translate as tr } from '../i18n';
import * as util from '../util';

export default class MapEditor {
    private metroMap: MetroMap;
    private button: HTMLButtonElement;
    private _editMode: boolean;

    get editMode() { return this._editMode; }

    set editMode(val: boolean) {
        if (val) {
            this.button.textContent = tr('Save map');;
            this.button.onclick = e => this.saveMapClick();
            const dummyCircles = document.getElementById('dummy-circles');
            dummyCircles.onmousedown = dummyCircles.onclick = null;
            this.metroMap.receiveEvent(new Event("editmapstart"));
        } else {
            this.button.textContent = tr('Edit map');
            this.button.onclick = e => this.editMapClick();
            this.metroMap.receiveEvent(new Event("editmapend"));
        }
        this._editMode = val;
    }

    constructor(metroMap: MetroMap, minZoom: number) {
        this.metroMap = metroMap;
        const btn = document.createElement('button');
        btn.id = 'edit-map-button';
        btn.textContent = 'Edit Map';
        btn.classList.add('leaflet-control');
        btn.onclick = e => this.editMapClick();
        document.querySelector('.leaflet-right.leaflet-top').appendChild(btn);
        this.button = btn;
        this.editMode = false;
        this.metroMap.getMap().on('zoomend', e => {
            if (this.editMode) {
                this.addMapListeners();
            }
        });
    }
    private editMapClick() {
        this.editMode = true;
        this.addMapListeners();
    }

    private saveMapClick() {
        util.downloadTextFile('graph.json', this.metroMap.getNetwork().toJSON());
        this.editMode = false;
    }

    private addMapListeners() {
        console.log('adding');
        // change station name (change -> model (platform))
        // drag station to new location (drag -> model (platform, spans) -> paths, )
        // create new station (create -> model)
        // drag line over the station to bind them
        const map = this.metroMap.getMap();
        const network = this.metroMap.getNetwork();
        const dummyCircles = document.getElementById('dummy-circles');

        dummyCircles.onmousedown = de => {
            if (de.button === 0) {
                const platform = util.platformByCircle(de.target as any, network);
                //const initialLocation = platform.location; // TODO: Ctrl+Z
                map.dragging.disable();
                map.on('mousemove', (le: L.LeafletMouseEvent) => {
                    platform.location = le.latlng;
                    this.metroMap.receiveEvent(new MouseEvent('platformmove'));
                }).once('mouseup', (le: L.LeafletMouseEvent) => {
                    map.off('mousemove').dragging.enable();
                    const circle = le.originalEvent.target as SVGCircleElement;
                    const moveEndEvent = new MouseEvent('platformmoveend', {relatedTarget: circle as EventTarget});
                    this.metroMap.receiveEvent(moveEndEvent);
                });
            } else if (de.button === 1) {
                //
            }
        };
    }
}