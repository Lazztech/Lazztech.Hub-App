import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import 'leaflet';
import { Map, marker, tileLayer } from 'leaflet';
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

  @Input() center: { latitude: any; longitude: any; };
  @Input() hubs: Array<{ id: number, latitude: number, longitude: number }> = [];
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

    if (this.hubs?.length) {
      this.hubs.forEach(hub => this.addMarker(hub));
    } else {
      marker([this.center.latitude, this.center.longitude])
        .addTo(this.map);
    }

    // Required to get the map to load properly
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  setCenter() {
    this.map.setView([this.center.latitude, this.center.longitude], 13);
  }

  addMarker(location: { id: number, latitude: number, longitude: number }) {
    const mk = marker([location.latitude, location.longitude]);
    if (this.navOnMarker) {
      mk.on('click', () => this.navCtrl.navigateForward('hub/' + location.id));
    }
    mk.addTo(this.map);
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
