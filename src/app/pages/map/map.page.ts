import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scalars } from '../../../graphql/graphql';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  queryParamsSubscription: Subscription;
  hubCoords: any;
  center: any;
  hubs = [];
  hubId: Scalars['ID'];
  loading = false;

  constructor(
    private router: Router,
    public locationService: LocationService,
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state) {
      this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
      this.center = this.hubCoords;
      if (this.router.getCurrentNavigation().extras.state?.hub) {
        this.hubId = this.router.getCurrentNavigation().extras.state.hub.id;
        this.hubs.push(this.router.getCurrentNavigation().extras.state.hub);
      }
      if (this.router.getCurrentNavigation().extras.state?.hubs) {
        this.hubs = this.router.getCurrentNavigation().extras.state.hubs;
      }
    }
  }

  onSearchSelected(event: { latitude: number, longitude: number }) {
    console.log('onSearchSelected');
    this.center = event;
  }

  onMapLoading(loading: boolean) {
    this.loading = loading;
  }
}
