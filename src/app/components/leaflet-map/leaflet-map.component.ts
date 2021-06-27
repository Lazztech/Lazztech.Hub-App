import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import 'leaflet';
import { Map, marker, tileLayer } from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { Hub } from '../../../generated/graphql';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: [
    './leaflet-map.component.scss',
    '../../../../node_modules/leaflet/dist/leaflet.css'
  ],
})
export class LeafletMapComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('map') mapContainer: ElementRef;
  map: Map;
  id = Date.now();
  searchResults: SearchResult<RawResult>[] = [];
  provider = new OpenStreetMapProvider();

  @Input() center: { latitude: any; longitude: any; };
  @Input() hubs: Hub[] = [];  
  @Input() navOnMarker = false;
  @Input() showControls = false;
  @Input() enableSearch = false;

  @Output() loading = new EventEmitter<boolean>();
  @Output() searchSelected = new EventEmitter<{ latitude: number, longitude: number }>();

  constructor(
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.center) {
      this.map.setView([this.center.latitude, this.center.longitude], 13);
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = new Map(`map${this.id}`, {
      zoomControl: this.showControls,
      dragging: this.showControls,
      doubleClickZoom: this.showControls
    }).setView([this.center.latitude, this.center.longitude], 13);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    if (this.hubs?.length) {
      this.hubs.forEach((hub: Hub) => {
        const mk = marker([hub.latitude, hub.longitude]);
        if (this.navOnMarker) {
          mk.on('click', () => this.navCtrl.navigateForward('hub/' + hub.id));
        }
        mk.addTo(this.map);
      });
    } else {
      marker([this.center.latitude, this.center.longitude])
        .addTo(this.map);
    }

    // Required to get the map to load properly
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
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
    })
    this.searchResults = [];
  }
}
