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
  userHubs: UsersHubsQuery['usersHubs'] = [];

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
      this.hubService.watchUserHubs(null, 2000).valueChanges.subscribe(async queryResult => {
        try {
          this.userHubs = queryResult?.data?.usersHubs;
          const position = await this.locationService.getCurrentPosition();
          for (const userHub of this.userHubs) {
            if (this.locationService.atHub(userHub.hub, position.coords)) {
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
