import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider';
import maplibregl, { GeoJSONSource, Map, SymbolLayerSpecification } from 'maplibre-gl';
import * as pmtiles from "pmtiles";
import layers from 'protomaps-themes-base';
import _ from 'lodash-es';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { environment } from 'src/environments/environment';

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
        url: `pmtiles://${environment.serverUrl}protomaps/tiles.pmtiles`,
        attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
      }
    },
    layers: layers("protomaps", this.themeService.isDark() ? 'black' : 'white')
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
  markerColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary');

  @Input() center: { latitude: any; longitude: any; };
  @Input() locations: Array<{ id: number, latitude: number, longitude: number }> = [];
  @Input() yourLocation: { latitude: any; longitude: any; };
  @Input() navOnMarker = false;
  @Input() showControls = false;
  @Input() enableSearch = false;
  @Input() attributionLocation = 'top-left';
  @Input() initialZoom: boolean = true;

  @Output() loading = new EventEmitter<boolean>();
  @Output() searchSelected = new EventEmitter<{ latitude: number, longitude: number, label: string }>();

  constructor(
    public navCtrl: NavController,
    public themeService: ThemeService,
  ) { }


  size = 100;
  // implementation of StyleImageInterface to draw a pulsing dot icon on the map
  // see https://maplibre.org/maplibre-gl-js-docs/api/properties/#styleimageinterface for more info
  yourLocationPulsingDot: any;
  yourLocationPulsingDotGeoData: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.yourLocation) {
      this.updateYourLocationMarker();
    }
  }

  ngAfterViewInit(): void {
    let protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
  }

  onMapLoad(map: Map) {
    console.log('map loaded', map);
    this.map = map;

    this.map.resize();
    
    if (this.initialZoom) {
      setTimeout(() => this.flyTo(this.center), 1000);
    }

    // for 3d building layer placement
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

    // prepare pulsing-dot for users location
    this.yourLocationPulsingDot = this.createPulsingDot(this.map, this.size);
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
  }

  public resize() {
    this.map?.resize();
  }

  flyTo(location?: { latitude?: number, longitude?: number}) {
    if (location?.latitude && location?.latitude) {
      this.map.flyTo({
        center: { 
          lat: location.latitude,
          lon: location.longitude
        },
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
    if (this.yourLocationPulsingDotGeoData?.features?.length) {
      this.yourLocationPulsingDotGeoData.features[0].geometry.coordinates = [this.yourLocation.longitude, this.yourLocation.latitude];
      (this.map.getSource('yourLocationPulsingDotPoint') as GeoJSONSource).setData(this.yourLocationPulsingDotGeoData);
    }
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
