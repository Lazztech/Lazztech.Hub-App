import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { UsersHubsQuery } from 'src/generated/graphql';
import { HubService } from './hub/hub.service';
import { LocationService } from './location/location.service';

@Injectable({
  providedIn: 'root'
})
export class ForegroundGeofenceService {

  subscriptions: Array<Subscription> = [];

  constructor(
    private logger: NGXLogger,
    private locationService: LocationService,
    private hubService: HubService
  ) { }

  /**
   * initializes forground geofence service
   * this watches for changes in users location in the forground
   * and 
   */
  init() {
    this.stop();
    this.logger.log(`initializing`);
    this.subscriptions.push(
      this.locationService.coords$.subscribe(async coords => {
        try {
          const usersHubs = await this.hubService.usersHubs();
          for (const userHub of usersHubs) {
            if (this.locationService.atHub(userHub.hub, coords)) {
              await this.hubService.enteredHubGeofence(userHub.hubId);
              this.logger.log(`enteredHubGeofence: ${userHub.hubId}`);
            } else {
              await this.hubService.exitedHubGeofence(userHub.hubId);
              this.logger.log(`exitedHubGeofence: ${userHub.hubId}`);
            }
          } 
        } catch (error) {
          this.logger.error(error); 
        }
      })
    );
  }

  stop() {
    this.subscriptions?.forEach(x => x.unsubscribe());
  }
}
