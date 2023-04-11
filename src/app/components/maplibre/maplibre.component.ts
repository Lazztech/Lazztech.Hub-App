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
    maplibregl.addProtocol("pmtiles",protocol.tile);
    this.map = new maplibregl.Map({
      container: 'map',
      style: {
        version: 8,
        glyphs: 'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
        sources: {
          "protomaps": {
            type: "vector",
            url: 'https://api.protomaps.com/tiles/v2/{z}/{x}/{y}.pbf?key=6fc55da14fd4da85',
            attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
          }
        },
        layers: layers("protomaps", "light")
      },
      center: { lat: this.center.latitude, lon: this.center.longitude },
      zoom: 9 // starting zoom
    });
  }

  setCenter() {
    if (this.center?.latitude && this.center?.longitude) {
      this.map.setCenter({ lat: this.center.latitude, lon: this.center.longitude }, 12);
    }
  }

}
