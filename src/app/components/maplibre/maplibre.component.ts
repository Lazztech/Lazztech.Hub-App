import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider';
import maplibregl, { GeoJSONSource, Map, SymbolLayerSpecification } from 'maplibre-gl';
import * as pmtiles from "pmtiles";
import layers from 'protomaps-themes-base';
import _ from 'lodash-es';

@Component({
  selector: 'app-maplibre',
  templateUrl: './maplibre.component.html',
  styleUrls: ['./maplibre.component.css']
})
export class MaplibreComponent implements OnChanges, AfterViewInit {

  style: any = {
    version: 8,
    glyphs: 'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
    sources: {
      "protomaps": {
        type: "vector",
        // url: "pmtiles://https://pub-9288c68512ed46eca46ddcade307709b.r2.dev/protomaps-sample-datasets/protomaps_vector_planet_odbl_z10.pmtiles",
        // url: "pmtiles://http://localhost:8080/file/protomaps_vector_planet_odbl_z10.pmtiles",
        url: 'pmtiles://https://r2-public.protomaps.com/protomaps-sample-datasets/protomaps-basemap-opensource-20230408.pmtiles',
        attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
      }
    },
    layers: layers("protomaps", "white")?.map(layer => {
      if (layer.id == 'buildings') {
        console.log(layer);
        const buildingLayerPaint = {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        };
        layer.paint = buildingLayerPaint;
      }
      return layer;
    })
  };
  // for reference if wanted later
  osmLibertyStyle = "https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style.json";
  labelLayerId
  /**
   * for accessing map instance
   */
  @ViewChild('map')
  map: Map;
  /**
   * leaflet geosearch results
   */
  searchResults: SearchResult<RawResult>[] = [];
  /**
   * leaflet geosearch provider
   */
  provider = new OpenStreetMapProvider();
  private debouncedSearchFunc: _.DebouncedFunc<() => Promise<void>> = _.debounce(
    (event: any) => this.searchAddress(event), 500
  );

  @Input() center: { latitude: any; longitude: any; };
  @Input() locations: Array<{ id: number, latitude: number, longitude: number }> = [];
  @Input() yourLocation: { latitude: any; longitude: any; };
  @Input() navOnMarker = false;
  @Input() showControls = false;
  @Input() enableSearch = false;
  @Input() attributionLocation = 'top-left';

  @Output() loading = new EventEmitter<boolean>();
  @Output() searchSelected = new EventEmitter<{ latitude: number, longitude: number, label: string }>();

  constructor(
    public navCtrl: NavController,
  ) { }

  modalInitialBreakpoint: number;
  markerColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary');

  size = 100;
  // implementation of StyleImageInterface to draw a pulsing dot icon on the map
  // see https://maplibre.org/maplibre-gl-js-docs/api/properties/#styleimageinterface for more info
  yourLocationPulsingDot: any;
  yourLocationPulsingDotGeoData: any;

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.map && changes.center) {
    //   this.flyTo();
    // }
    if (this.map && changes.yourLocation) {
      this.updateYourLocationMarker();
    }
  }

  ngAfterViewInit(): void {
    let protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    const searchBarHeightPixes = 60;
    const screenHeight = window.screen.height;
    const percentage = (screenHeight - searchBarHeightPixes) / screenHeight; // 0.92%
    console.log(percentage)
    this.modalInitialBreakpoint = percentage / 10;
  }

  onMapLoad(map: Map) {
    console.log('map loaded', map);
    this.map = map;

    this.map.resize();
    
    setTimeout(() => this.flyTo(), 1000);

    console.log(this.map.getLayer('building'))
    console.log(this.map.getLayer('buildings'))
    console.log(this.map.getLayer('3d-buildings'))

    const layers = map.getStyle().layers!;

    for (let i = 0; i < layers.length; i++) {
      if (
        layers[i].type === 'symbol' &&
        (<SymbolLayerSpecification>layers[i]).layout!['text-field']
      ) {
        this.labelLayerId = layers[i].id;
        break;
      }
    }

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
            'coordinates': [this.yourLocation?.longitude, this.yourLocation?.latitude]
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
        zoom: 11,
      });
    }
  }

  markerOnClick(location) {
    if (this.showControls) {
      this.navCtrl.navigateForward('hub/' + location.id);
    }
  }

  updateYourLocationMarker() {
    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    this.yourLocationPulsingDotGeoData.features[0].geometry.coordinates = [this.yourLocation.longitude, this.yourLocation.latitude];
    (this.map.getSource('yourLocationPulsingDotPoint') as GeoJSONSource).setData(this.yourLocationPulsingDotGeoData);
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
