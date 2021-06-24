import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider';
import { HubService } from '../../services/hub/hub.service';
import { Scalars } from '../../../generated/graphql';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  queryParamsSubscription: Subscription;
  hubCoords: any;
  center: any;
  hubs = [];
  searchResults: SearchResult<RawResult>[] = [];

  hubId: Scalars['ID'];
  loading = false;
  provider = new OpenStreetMapProvider();

  constructor(
    private router: Router,
    private logger: NGXLogger,
    private hubService: HubService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
      this.center = this.hubCoords;
      if (this.router.getCurrentNavigation().extras.state.hub) {
        this.hubs.push(this.router.getCurrentNavigation().extras.state.hub);
      }
      if (this.router.getCurrentNavigation().extras.state.hubs) {
        this.hubs = this.router.getCurrentNavigation().extras.state.hubs;
      }
    }
  }

  async ngOnInit() {
  }

  async searchAddress(event: any) {
    console.log(event);
    this.loading = true;
    const results = await this.provider.search({ query: event.target.value });
    console.log(results);
    this.searchResults = results as any;
    this.loading = false;
  }

  selectSearch(searchResult: SearchResult<RawResult>) {
    this.center = {
      latitude: searchResult.y,
      longitude: searchResult.x
    };
    this.searchResults = [];
  }

  save() {
    this.hubService.changeHubLocation(this.hubId, this.center.latitude, this.center.longitude);
  }
}
