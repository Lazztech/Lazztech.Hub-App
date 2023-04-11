import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import maplibregl, { Map } from 'maplibre-gl';

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
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
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
