import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { DwellEventGeofenceGQL, EnteredEventGeofenceGQL, ExitedEventGeofenceGQL, UserEventsGQL } from 'src/graphql/graphql';
import { HubService } from './hub/hub.service';
import { LocationService } from './location/location.service';

@Injectable({
  providedIn: 'root'
})
export class ForegroundGeofenceService {

  constructor(
    private logger: NGXLogger,
    private locationService: LocationService,
    private hubService: HubService,
    private readonly userEvents: UserEventsGQL,
    private readonly enteredEventGeofenceService: EnteredEventGeofenceGQL,
    private readonly dwellEventGeofenceService: DwellEventGeofenceGQL,
    private readonly exitedEventGeofenceService: ExitedEventGeofenceGQL,
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
        const atLocation = this.locationService.atLocation(userHub.hub, coords);
        if (!userHub.isPresent && atLocation) {
          await this.hubService.enteredHubGeofence(userHub.hubId);
          this.logger.log(`enteredHubGeofence: ${userHub.hubId}`);
        }
        if (userHub.isPresent && !atLocation) {
          await this.hubService.exitedHubGeofence(userHub.hubId);
          this.logger.log(`exitedHubGeofence: ${userHub.hubId}`);
        }
      }

      const userEvents = await this.userEvents.fetch().toPromise();
      for (const userEvent of userEvents.data.usersEvents) {
        const atLocation = this.locationService.atLocation(userEvent.event, coords);
        if (!userEvent.isPresent && atLocation) {
          await this.enteredEventGeofenceService.mutate({ eventId: userEvent.eventId }).toPromise();
          this.logger.log(`enteredEventGeofenceService: ${userEvent.eventId}`);
        }
        if (userEvent.isPresent && !atLocation) {
          await this.exitedEventGeofenceService.mutate({ eventId: userEvent.eventId }).toPromise();
          this.logger.log(`exitedEventGeofenceService: ${userEvent.eventId}`);
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
