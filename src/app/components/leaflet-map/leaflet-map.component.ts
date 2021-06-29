import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import 'leaflet';
import { circle, CircleMarker, circleMarker, Map, marker, tileLayer } from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';

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

  @Input() center: { latitude: any; longitude: any; };
  @Input() locations: Array<{ id: number, latitude: number, longitude: number }> = [];
  @Input() yourLocation: { latitude: any; longitude: any; };
  @Input() navOnMarker = false;
  @Input() showControls = false;
  @Input() enableSearch = false;

  @Output() loading = new EventEmitter<boolean>();
  @Output() searchSelected = new EventEmitter<{ latitude: number, longitude: number }>();

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
  }

  /**
   * map must be initialized at this point in the ng lifecycle to load properly
   */
  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = new Map(`map${this.id}`, {
      zoomControl: this.showControls,
      dragging: this.showControls,
      doubleClickZoom: this.showControls
    }).addLayer(tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }));

    this.setCenter();
    this.locations?.forEach(hub => this.addMarker(hub));
    this.locations?.forEach(hub => this.drawRadius(hub));

    if (this.yourLocation) {
      this.updateYourLocationMarker();
    }

    if (!this.locations?.length) {
      this.addMarker({ latitude: this.center.latitude, longitude: this.center.longitude });
      this.drawRadius({ latitude: this.center.latitude, longitude: this.center.longitude });
    }

    // Required to get the map to load properly
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  setCenter() {
    this.map.setView([this.center.latitude, this.center.longitude], 13);
  }

  addMarker(location: { id?: number, latitude: number, longitude: number }) {
    const mk = marker([location.latitude, location.longitude]);
    if (this.navOnMarker && location?.id) {
      mk.on('click', () => this.navCtrl.navigateForward('hub/' + location.id));
    }
    mk.addTo(this.map);
  }

  updateYourLocationMarker() {
    if (this.yourLocationMarker && this.map) {
      this.map.removeLayer(this.yourLocationMarker);
    }
    this.yourLocationMarker = circleMarker([this.yourLocation.latitude, this.yourLocation.longitude]).addTo(this.map);
  }

  drawRadius(location: { latitude: number, longitude: number }, radiusMeters = 200) {
    return circle([location.latitude, location.longitude], radiusMeters).addTo(this.map);
  }

  async searchAddress(event: any) {
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
      longitude: searchResult.x
    });
    this.searchResults = [];
  }
}
