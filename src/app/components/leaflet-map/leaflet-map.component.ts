import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Map, tileLayer, marker, icon, DomUtil } from 'leaflet';
import { map } from 'rxjs/operators';
import { Hub } from '../../../generated/graphql';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: [
    './leaflet-map.component.scss',
    '../../../../node_modules/leaflet/dist/leaflet.css'
  ],
})
export class LeafletMapComponent implements OnInit, AfterViewInit {

  @Input() center: { latitude: any; longitude: any; };
  @Input() hubs: Hub[] = [];
  @Input() navOnMarker = false;
  @Input() showControls = false;
  @ViewChild('map') mapContainer: ElementRef;
  map: Map;
  id = Date.now()

  constructor(
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
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
        const mk = marker([hub.latitude, hub.longitude])
        if (this.navOnMarker) {
          mk.on('click', () => this.navCtrl.navigateForward('hub/'+ hub.id))
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
}
