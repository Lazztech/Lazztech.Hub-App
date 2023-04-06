import { Component, OnInit } from '@angular/core';
import maplibreGl, { Map, Marker, NavigationControl } from 'maplibre-gl';

@Component({
  selector: 'app-maplibre',
  templateUrl: './maplibre.component.html',
  styleUrls: ['./maplibre.component.css']
})
export class MaplibreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const map = new maplibreGl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  }

}
