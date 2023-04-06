import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import maplibreGl, { Map, Marker, NavigationControl } from 'maplibre-gl';
import { environment } from 'src/environments/environment';

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
    this.map = new maplibreGl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    // this.map = new Map(`map${this.id}`, {
    //   zoomControl: this.showControls,
    //   dragging: this.showControls,
    //   doubleClickZoom: this.showControls
    // }).addLayer(tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }));

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
    // setTimeout(() => {
    //   this.map.invalidateSize();
    // }, 100);
  }

  setCenter() {
    if (this.center?.latitude && this.center?.longitude) {
      // this.map.setView([this.center?.latitude, this.center?.longitude], 13);
    }
  }

  // public invalidateSize() {
  //   this.map?.invalidateSize();
  //   console.log('invalidateSize');
  // }

  addMarker(location: { id?: number, latitude: number, longitude: number }) {
    // if (location) {
    //   const mk = marker([location.latitude, location.longitude]);
    //   if (this.navOnMarker && location?.id) {
    //     mk.on('click', () => this.navCtrl.navigateForward('hub/' + location.id));
    //   }
    //   mk.addTo(this.map);
    // }
  }

  updateYourLocationMarker() {
    // if (this.yourLocationMarker && this.map) {
    //   this.map.removeLayer(this.yourLocationMarker);
    // }
    // this.yourLocationMarker = circleMarker([this.yourLocation.latitude, this.yourLocation.longitude]).addTo(this.map);
  }

  drawRadius(location: { latitude: number, longitude: number }, radiusMeters = environment.geofenceRadius) {
    // if (location) {
    //   return circle([location.latitude, location.longitude], radiusMeters).addTo(this.map);
    // }
    // return undefined;
  }

  private async searchAddress(event: any) {
    // console.log(event);
    // this.loading.emit(true);

    // const results = await this.provider.search({ query: event.target.value });
    // console.log(results);
    // this.searchResults = results as any;
    // this.loading.emit(false);
  }

  selectSearch(searchResult: SearchResult<RawResult>) {
    // this.searchSelected.emit({
    //   latitude: searchResult.y,
    //   longitude: searchResult.x,
    //   label: searchResult.label,
    // });
    // this.searchResults = [];
  }

}
