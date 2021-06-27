import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scalars } from '../../../generated/graphql';
import { HubService } from '../../services/hub/hub.service';

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
    private hubService: HubService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
      this.center = this.hubCoords;
      if (this.router.getCurrentNavigation().extras.state.hub) {
        this.hubId = this.router.getCurrentNavigation().extras.state.hub.id;
        this.hubs.push(this.router.getCurrentNavigation().extras.state.hub);
      }
      if (this.router.getCurrentNavigation().extras.state.hubs) {
        this.hubs = this.router.getCurrentNavigation().extras.state.hubs;
      }
    }
  }

  onSearchSelected(event: { latitude: number, longitude: number }) {
    console.log('onSearchSelected');
    this.center = event;
  }

  async save() {
    console.log(`map save hubId: ${this.hubId}, center latitude: ${this.center.latitude}, center longitude: ${this.center.longitude}`);
    this.loading = true;
    await this.hubService.changeHubLocation(this.hubId, this.center.latitude, this.center.longitude);
    this.loading = false;
  }

  onMapLoading(loading: boolean) {
    this.loading = loading;
  }
}
