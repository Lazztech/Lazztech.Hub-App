import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import 'leaflet';
import { circle, CircleMarker, circleMarker, Map, marker, tileLayer } from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { environment } from 'src/environments/environment';
import _ from 'lodash-es';
import * as protomaps from 'protomaps';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: [
    './leaflet-map.component.scss',
    '../../../../node_modules/leaflet/dist/leaflet.css'
  ],
})
export class LeafletMapComponent implements OnChanges, AfterViewInit {

  /**
   * used to ensure unique map instances to allow for multiple maps
   */
  id = Date.now();
  /**
   * for accessing map instance
   */
  map: Map;
  /**
   * for accessing map instance containing element
   */
  @ViewChild('map') mapContainer: ElementRef;
  /**
   * leaflet geosearch results
   */
  searchResults: SearchResult<RawResult>[] = [];
  /**
   * leaflet geosearch provider
   */
  provider = new OpenStreetMapProvider();
  /**
   * leaflet circle marker instance that's used to draw your location
   */
  yourLocationMarker: CircleMarker;

  private debouncedSearchFunc: _.DebouncedFunc<() => Promise<void>> = _.debounce(
    (event: any) => this.searchAddress(event), 500
  );

  @Input() center: { latitude: any; longitude: any; };
  @Input() locations: Array<{ id: number, latitude: number, longitude: number }> = [];
  @Input() yourLocation: { latitude: any; longitude: any; };
  @Input() navOnMarker = false;
  @Input() showControls = false;
  @Input() enableSearch = false;

  @Output() loading = new EventEmitter<boolean>();
  @Output() searchSelected = new EventEmitter<{ latitude: number, longitude: number, label: string }>();

  constructor(
    public navCtrl: NavController,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.center) {
      this.setCenter();
    }
    if (this.map && changes.yourLocation) {
      this.updateYourLocationMarker();
    }
    if (this.map && changes?.locations) {
      this.locations?.forEach(location => this.addMarker(location));
    }
  }

  /**
   * map must be initialized at this point in the ng lifecycle to load properly
   */
  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const pmtilesUrl = 'https://pub-9288c68512ed46eca46ddcade307709b.r2.dev/protomaps-sample-datasets/protomaps_vector_planet_odbl_z10.pmtiles';
    const apiUrl = 'https://api.protomaps.com/tiles/v2/{z}/{x}/{y}.pbf?key=6fc55da14fd4da85'
    this.map = new Map(`map${this.id}`, {
      zoomControl: this.showControls,
      dragging: this.showControls,
      // maxZoom: 11,
      // doubleClickZoom: this.showControls,
      // attributionControl: false,
    });
    // .addLayer(tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //     tileSize: 128,
    //     zoomOffset: 1
    // }));
    const layer = protomaps.leafletLayer({url: apiUrl})
    layer.addTo(this.map);

    this.setCenter();
    this.locations?.forEach(hub => this.addMarker(hub));
    this.locations?.forEach(hub => this.drawRadius(hub));

    if (this.yourLocation) {
      this.updateYourLocationMarker();
    }

    if (!this.locations?.length && this.center?.latitude && this.center?.longitude) {
      this.addMarker({ latitude: this.center.latitude, longitude: this.center.longitude });
      this.drawRadius({ latitude: this.center.latitude, longitude: this.center.longitude });
    }

    // Required to get the map to load properly
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  setCenter() {
    if (this.center?.latitude && this.center?.longitude) {
      this.map.setView([this.center?.latitude, this.center?.longitude], 11);
    }
  }

  public invalidateSize() {
    this.map?.invalidateSize();
    console.log('invalidateSize');
  }

  addMarker(location: { id?: number, latitude: number, longitude: number }) {
    if (location) {
      const mk = marker([location.latitude, location.longitude]);
      if (this.navOnMarker && location?.id) {
        mk.on('click', () => this.navCtrl.navigateForward('hub/' + location.id));
      }
      mk.addTo(this.map);
    }
  }

  updateYourLocationMarker() {
    if (this.yourLocationMarker && this.map) {
      this.map.removeLayer(this.yourLocationMarker);
    }
    this.yourLocationMarker = circleMarker([this.yourLocation.latitude, this.yourLocation.longitude]).addTo(this.map);
  }

  drawRadius(location: { latitude: number, longitude: number }, radiusMeters = environment.geofenceRadius) {
    if (location) {
      return circle([location.latitude, location.longitude], radiusMeters).addTo(this.map);
    }
    return undefined;
  }

  private async searchAddress(event: any) {
    console.log(event);
    this.loading.emit(true);

    const results = await this.provider.search({ query: event.target.value });
    console.log(results);
    this.searchResults = results as any;
    this.loading.emit(false);
  }

  selectSearch(searchResult: SearchResult<RawResult>) {
    this.searchSelected.emit({
      latitude: searchResult.y,
      longitude: searchResult.x,
      label: searchResult.label,
    });
    this.searchResults = [];
  }
}
