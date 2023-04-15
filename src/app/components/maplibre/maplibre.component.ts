import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import maplibregl, { Map } from 'maplibre-gl';
import * as pmtiles from "pmtiles";
import layers from 'protomaps-themes-base';

@Component({
  selector: 'app-maplibre',
  templateUrl: './maplibre.component.html',
  styleUrls: ['./maplibre.component.css']
})
export class MaplibreComponent implements OnChanges, AfterViewInit {

  map: Map;

  @Input() center: { latitude: any; longitude: any; };
  @Input() locations: Array<{ id: number, latitude: number, longitude: number }> = [];
  @Input() yourLocation: { latitude: any; longitude: any; };
  @Input() navOnMarker = false;
  @Input() showControls = false;
  @Input() enableSearch = false;

  @Output() loading = new EventEmitter<boolean>();
  @Output() searchSelected = new EventEmitter<{ latitude: number, longitude: number, label: string }>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.center) {
      this.setCenter();
    }
    // if (this.map && changes.yourLocation) {
    //   this.updateYourLocationMarker();
    // }
    // if (this.map && changes?.locations) {
    //   this.locations?.forEach(location => this.addMarker(location));
    // }
  }

  ngAfterViewInit(): void {
    let protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    this.map = new maplibregl.Map({
      container: 'map',
      scrollZoom: true,
      style: 'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style.json',
      // style: 'https://raw.githubusercontent.com/openmaptiles/maptiler-3d-gl-style/master/style.json',
      // style: 'https://tiles.stadiamaps.com/styles/osm_bright.json',
      zoom: 16, // starting zoom
      pitch: 45,
      bearing: -17.6,
      antialias: true,
      attributionControl: true,
      customAttribution: 'asdf'
    });

    // The 'building' layer in the streets vector source contains building-height
    // data from OpenStreetMap.
    this.map.on('load', () => {
      this.map.resize();
      this.setCenter();

      this.map.addSource('protomaps', {
        type: "vector",
        url: 'pmtiles://https://pub-9288c68512ed46eca46ddcade307709b.r2.dev/protomaps-sample-datasets/protomaps_vector_planet_odbl_z10.pmtiles',
        attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
      });

      // Insert the layer beneath any symbol layer.
      const layers = this.map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      this.map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'openmaptiles',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'] as any
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']  as any
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });
  }

  setCenter() {
    if (this.center?.latitude && this.center?.longitude) {
      this.map.setCenter({ lat: this.center.latitude, lon: this.center.longitude }, 12);
    }
  }

}
