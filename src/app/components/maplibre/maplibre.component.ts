import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import maplibregl, { GeoJSONSource, Map } from 'maplibre-gl';
import * as pmtiles from "pmtiles";

@Component({
  selector: 'app-maplibre',
  templateUrl: './maplibre.component.html',
  styleUrls: ['./maplibre.component.css']
})
export class MaplibreComponent implements OnChanges, AfterViewInit {

  /**
   * used to ensure unique map instances to allow for multiple maps
   */
  id = Date.now();
  /**
   * for accessing map instance
   */
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

  size = 100;

  // implementation of StyleImageInterface to draw a pulsing dot icon on the map
  // see https://maplibre.org/maplibre-gl-js-docs/api/properties/#styleimageinterface for more info
  yourLocationPulsingDot: any;
  yourLocationPulsingDotGeoData: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.center) {
      this.flyTo();
    }
    if (this.map && changes.yourLocation) {
      this.updateYourLocationMarker();
    }
    if (this.map && changes?.locations) {
      this.locations?.forEach(location => this.addMarker(location));
    }
  }

  ngAfterViewInit(): void {
    let protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    this.map = new maplibregl.Map({
      container: `map${this.id}`,
      scrollZoom: true,
      style: 'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style.json',
      zoom: 16, // starting zoom
      pitch: 45,
      // bearing: -17.6,
      antialias: true,
      attributionControl: false
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

      // Add zoom and rotation controls to the map.
      this.map.addControl(new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: false,
      }));

      console.log(this.map)

      this.map.addControl(new maplibregl.AttributionControl({
        compact: false,
      }));

      // this.rotateCamera(0, this.map);
      this.yourLocationPulsingDot = this.createPulsingDot(this.map, this.size);
      this.map.addImage('pulsing-dot', this.yourLocationPulsingDot, { pixelRatio: 2 });
      this.yourLocationPulsingDotGeoData = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [this.center.longitude, this.center.latitude]
            }
          }
        ]
      };
      this.map.addSource('yourLocationPulsingDotPoint', {
        'type': 'geojson',
        'data': this.yourLocationPulsingDotGeoData,
      });
      this.map.addLayer({
        'id': 'yourLocationPulsingDotPoint',
        'type': 'symbol',
        'source': 'yourLocationPulsingDotPoint',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });
    });

    if (this.locations) {
      this.locations?.forEach(location => this.addMarker(location));
    }
  }

  rotateCamera(timestamp, map) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 100) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame((t) => this.rotateCamera(t, map));
  }

  flyTo() {
    if (this.center?.latitude && this.center?.longitude) {
      this.map.flyTo({ 
        center: { lat: this.center.latitude, lon: this.center.longitude },
        zoom: 16,
      });
    }
  }

  setCenter() {
    if (this.center?.latitude && this.center?.longitude) {
      this.map.setCenter({ lat: this.center.latitude, lon: this.center.longitude }, 12);
    }
  }

  addMarker(location: { id?: number, latitude: number, longitude: number }) {
    if (location) {
      const mk = new maplibregl.Marker({ color: getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary') })
        .setLngLat({ lat: location.latitude, lon: location.longitude })
        .addTo(this.map);
      if (this.navOnMarker && location?.id) {
        mk.on('click', () => this.navCtrl.navigateForward('hub/' + location.id));
      }
      mk.addTo(this.map);
    }
  }

  updateYourLocationMarker() {
    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    this.yourLocationPulsingDotGeoData.features[0].geometry.coordinates = [this.yourLocation.longitude, this.yourLocation.latitude];
    (this.map.getSource('yourLocationPulsingDotPoint') as GeoJSONSource).setData(this.yourLocationPulsingDotGeoData);
  }

  createPulsingDot = (map: Map, size: number) => ({
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // get rendering context for the map canvas when layer is added to the map
    onAdd: function () {
      var canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      this.context = canvas.getContext('2d');
    },

    // called once before every frame where the icon will be used
    render: function () {
      var duration = 1000;
      var t = (performance.now() % duration) / duration;

      var radius = (size / 2) * 0.3;
      var outerRadius = (size / 2) * 0.7 * t + radius;
      var context = this.context;

      // draw outer circle
      context.clearRect(0, 0, size, size);
      context.beginPath();
      context.arc(
        size / 2,
        size / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
      context.fill();

      // draw inner circle
      context.beginPath();
      context.arc(
        size / 2,
        size / 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(255, 100, 100, 1)';
      context.strokeStyle = 'white';
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();

      // update this image's data with data from the canvas
      this.data = context.getImageData(
        0,
        0,
        size,
        size
      ).data;

      // continuously repaint the map, resulting in the smooth animation of the dot
      map.triggerRepaint();

      // return `true` to let the map know that the image was updated
      return true;
    }
  });

}
