import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { HubService } from './hub/hub.service';
import { LocationService } from './location/location.service';

@Injectable({
  providedIn: 'root'
})
export class ForegroundGeofenceService {

  constructor(
    private logger: NGXLogger,
    private locationService: LocationService,
    private hubService: HubService
  ) { }

  /**
   * checks for changes in supplied location in the forground
   * and users location points
   */
  async asses(coords: { latitude: number, longitude: number }) {
    this.logger.log(`initializing`);
    try {
      const usersHubs = await this.hubService.usersHubs();
      for (const userHub of usersHubs) {
        const atHub = this.locationService.atHub(userHub.hub, coords);
        if (!userHub.isPresent && atHub) {
          await this.hubService.enteredHubGeofence(userHub.hubId);
          this.logger.log(`enteredHubGeofence: ${userHub.hubId}`);
        }
        if (userHub.isPresent && !atHub) {
          await this.hubService.exitedHubGeofence(userHub.hubId);
          this.logger.log(`exitedHubGeofence: ${userHub.hubId}`);
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
