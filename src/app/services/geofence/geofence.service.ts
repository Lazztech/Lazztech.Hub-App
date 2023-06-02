import { Injectable } from '@angular/core';
import BackgroundGeolocation, {
  GeofenceEvent
} from '@transistorsoft/capacitor-background-geolocation';
import { NGXLogger } from 'ngx-logger';
import { DwellEventGeofenceGQL, EnteredEventGeofenceGQL, Event, ExitedEventGeofenceGQL, Hub, UserEventsGQL } from 'src/graphql/graphql';
import { environment } from '../../../environments/environment';
import { HubService } from '../hub/hub.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface IGeofence {
  identifier: string;
  latitude: number;
  longitude: number;
  radius?: number,
  notifyOnEntry?: boolean;
  notifyOnExit?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GeofenceService {

  constructor(
    private hubService: HubService,
    private readonly userEvents: UserEventsGQL,
    private readonly enteredEventGeofenceService: EnteredEventGeofenceGQL,
    private readonly dwellEventGeofenceService: DwellEventGeofenceGQL,
    private readonly exitedEventGeofenceService: ExitedEventGeofenceGQL,
    private logger: NGXLogger
  ) { }

  async addGeofence(geofence: IGeofence) {
    BackgroundGeolocation.addGeofence({
      identifier: geofence.identifier,
      latitude: geofence.latitude,
      longitude: geofence.longitude,
      radius: environment.geofenceRadius,
      notifyOnEntry: true,
      notifyOnDwell: true,
      notifyOnExit: true,
      loiteringDelay: 20000,
    }).then((success) => {
      this.logger.log('[addGeofence] success');
    }).catch((error) => {
      this.logger.log('[addGeofence] FAILURE: ', error);
    });
  }

  async removeAllGeofences() {
    await BackgroundGeolocation.removeGeofences();
    this.logger.log('[removeGeofences] all geofences have been destroyed');
  }

  async syncGeofences() {
    const userHubs = await this.hubService.usersHubs();
    const userEvents = await this.userEvents.fetch().toPromise();
    const geofences = await BackgroundGeolocation.getGeofences();
    // add any missing geofences
    for (const userHub of userHubs) {
      const identifier = this.mapHubToGeofenceIdentifier(userHub.hub as Hub);
      if (!geofences.some(gf => gf.identifier == identifier)) {
        await this.addGeofence({
          identifier: identifier,
          latitude: userHub.hub.latitude,
          longitude: userHub.hub.longitude,
        });
        this.logger.log(`Added geofence ${identifier}`);
      }
    }
    for (const userEvent of userEvents.data.usersEvents) {
      const identifier = this.mapEventToGeofenceIdentifier(userEvent.event as Event);
      if (!geofences.some(gf => gf.identifier == identifier) && userEvent?.event?.longitude && userEvent?.event?.latitude) {
        await this.addGeofence({
          identifier: identifier,
          latitude: userEvent.event.latitude,
          longitude: userEvent.event.longitude,
        });
        this.logger.log(`Added geofence ${identifier}`);
      }
    }

    // remove any no longer relivant geofences
    const noLongerRelivantGeofences =
      [
        ...geofences.filter(
          geofence => !userHubs.some(
            userHub => geofence.identifier == this.mapHubToGeofenceIdentifier(userHub.hub as Hub)
          )
        ),
        ...geofences.filter(
          geofence => !userEvents.data.usersEvents.some(
            userEvent => geofence.identifier == this.mapEventToGeofenceIdentifier(userEvent.event as Event)
          )
        )
      ];
    for (const noLongerRelivantGeofence of noLongerRelivantGeofences) {
      await BackgroundGeolocation.removeGeofence(
        noLongerRelivantGeofence.identifier,
      )
      this.logger.log(`Removed geofence ${noLongerRelivantGeofence.identifier}`);
    }
  }

  mapHubToGeofenceIdentifier(hub: Hub): string {
    return JSON.stringify({
      id: hub.id,
      name: hub.name,
      __typename: hub.__typename,
    });
  }

  mapEventToGeofenceIdentifier(event: Event): string {
    return JSON.stringify({
      id: event.id,
      name: event.name,
      __typename: event.__typename,
    });
  }

  async isPowerSaveMode() {
    if (Capacitor.isNativePlatform()) {
      // FIXME: seems to always return false
      return await BackgroundGeolocation.isPowerSaveMode();
    }
  }

  async configureBackgroundGeolocation() {
    BackgroundGeolocation.onGeofence(async geofence => {
      this.logger.log('[geofence] ', geofence.identifier, geofence.action);

      // Perform some long-running task (eg: HTTP request)
      BackgroundGeolocation.startBackgroundTask().then(async (taskId) => {
        const location = JSON.parse(geofence.identifier);

        if (geofence.action === 'ENTER' && location.__typename === "Hub") {
          await this.enteredHubGeofence(location, geofence).catch(error => {
            // Be sure to catch errors:  never leave you background-task hanging.
            this.logger.error(error);
            BackgroundGeolocation.stopBackgroundTask(taskId);
          });
        } else if (geofence.action === 'EXIT' && location.__typename === "Hub") {
          await this.exitedHubGeofence(location, geofence).catch(error => {
            // Be sure to catch errors:  never leave you background-task hanging.
            this.logger.error(error);
            BackgroundGeolocation.stopBackgroundTask(taskId);
          });
        } else if (geofence.action == "DWELL" && location.__typename === "Hub") {
          this.dwellHubGeofence(location, geofence).catch(error => {
            // Be sure to catch errors:  never leave you background-task hanging.
            this.logger.error(error);
            BackgroundGeolocation.stopBackgroundTask(taskId);
          });
        } else if (geofence.action === 'ENTER' && location.__typename === "Event") {
          await this.enteredEventGeofence(location, geofence).catch(error => {
            // Be sure to catch errors:  never leave you background-task hanging.
            this.logger.error(error);
            BackgroundGeolocation.stopBackgroundTask(taskId);
          });
        } else if (geofence.action === 'EXIT' && location.__typename === "Event") {
          await this.exitedEventGeofence(location, geofence).catch(error => {
            // Be sure to catch errors:  never leave you background-task hanging.
            this.logger.error(error);
            BackgroundGeolocation.stopBackgroundTask(taskId);
          });
        } else if (geofence.action === "DWELL" && location.__typename === "Event") {
          await this.dwellEventGeofence(location, geofence).catch(error => {
            // Be sure to catch errors:  never leave you background-task hanging.
            this.logger.error(error);
            BackgroundGeolocation.stopBackgroundTask(taskId);
          });
        }
        // When your long-running task is complete, signal completion of taskId.
        BackgroundGeolocation.stopBackgroundTask(taskId);
      });

    });


    // 1.  Listen to events.
    BackgroundGeolocation.onLocation(location => {
      this.logger.log('[location] - ', location);
    });

    BackgroundGeolocation.onMotionChange(event => {
      this.logger.log('[motionchange] - ', event.isMoving, event.location);
    });

    BackgroundGeolocation.onHttp(response => {
      this.logger.log('[http] - ', response.success, response.status, response.responseText);
    });

    BackgroundGeolocation.onProviderChange(event => {
      this.logger.log('[providerchange] - ', event.enabled, event.status, event.gps);
    });
  }

  public async ready() {
    const state = await BackgroundGeolocation.ready(environment.backgroundGeoLocationConfig);
    this.logger.log('[ready] BackgroundGeolocation is ready to use');
    return state;
  }

  public async start() {
      return await BackgroundGeolocation.start();
  }

  public async getBackgroundGeolocationState() {
    if (Capacitor.isNativePlatform()) {
      return await BackgroundGeolocation.getState();
    }
  }

  public async getGeofences() {
    if (Capacitor.isNativePlatform()) {
      return BackgroundGeolocation.getGeofences();
    }
  }

  public async getLocations() {
    if (Capacitor.isNativePlatform()) {
      return BackgroundGeolocation.getLocations();
    }
  }

  // Hub Geofence Events

  private async exitedHubGeofence(hub: Hub, geofence: GeofenceEvent) {
    await this.hubService.exitedHubGeofence(hub.id).catch(err => {
      if (!environment.production) {
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'Geofence error',
              body: JSON.stringify(err),
              id: parseInt(hub.id, 10),
              schedule: { at: new Date(Date.now()) },
              sound: 'beep.aiff',
              attachments: null,
              actionTypeId: '',
              extra: null
            }
          ]
        });
      }
    });
    if (!environment.production) {
      LocalNotifications.schedule({
        notifications: [
          {
            title: 'Exited ' + hub.name,
            body: geofence.action + ' ' + hub.name,
            id: parseInt(hub.id, 10),
            schedule: { at: new Date(Date.now()) },
            sound: 'beep.aiff',
            attachments: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    }
  }

  private async dwellHubGeofence(hub: Hub, geofence: GeofenceEvent) {
    await this.hubService.dwellHubGeofence(hub.id).catch(err => {
      if (!environment.production) {
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'Geofence error',
              body: JSON.stringify(err),
              id: parseInt(hub.id, 10),
              schedule: { at: new Date(Date.now()) },
              sound: 'beep.aiff',
              attachments: null,
              actionTypeId: '',
              extra: null
            }
          ]
        });
      }
    });
    if (!environment.production) {
      LocalNotifications.schedule({
        notifications: [
          {
            title: 'Dwell ' + hub.name,
            body: geofence.action + ' ' + hub.name,
            id: parseInt(hub.id, 10),
            schedule: { at: new Date(Date.now()) },
            sound: 'beep.aiff',
            attachments: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    }
  }

  private async enteredHubGeofence(hub: Hub, geofence: GeofenceEvent) {
    await this.hubService.enteredHubGeofence(hub.id).catch(err => {
      if (!environment.production) {
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'Geofence error',
              body: JSON.stringify(err),
              id: parseInt(hub.id, 10),
              schedule: { at: new Date(Date.now()) },
              sound: 'beep.aiff',
              attachments: null,
              actionTypeId: '',
              extra: null,
            }
          ]
        });
      }
    });
    if (!environment.production) {
      LocalNotifications.schedule({
        notifications: [
          {
            title: 'Entered ' + hub.name,
            body: geofence.action + ' ' + hub.name,
            id: parseInt(hub.id, 10),
            schedule: { at: new Date(Date.now()) },
            sound: 'beep.aiff',
            attachments: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    }
  }

  // Event Geofence Events

  private async enteredEventGeofence(event: Event, geofence: GeofenceEvent) {
    await this.enteredEventGeofenceService.mutate({ eventId: event.id }).toPromise().catch(err => {
      if (!environment.production) {
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'Geofence error',
              body: JSON.stringify(err),
              id: parseInt(event.id, 10),
              schedule: { at: new Date(Date.now()) },
              sound: 'beep.aiff',
              attachments: null,
              actionTypeId: '',
              extra: null,
            }
          ]
        });
      }
    });
    if (!environment.production) {
      LocalNotifications.schedule({
        notifications: [
          {
            title: 'Entered ' + event.name,
            body: geofence.action + ' ' + event.name,
            id: parseInt(event.id, 10),
            schedule: { at: new Date(Date.now()) },
            sound: 'beep.aiff',
            attachments: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    }
  }

  private async dwellEventGeofence(event: Event, geofence: GeofenceEvent) {
    await this.dwellEventGeofenceService.mutate({ eventId: event.id }).toPromise().catch(err => {
      if (!environment.production) {
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'Geofence error',
              body: JSON.stringify(err),
              id: parseInt(event.id, 10),
              schedule: { at: new Date(Date.now()) },
              sound: 'beep.aiff',
              attachments: null,
              actionTypeId: '',
              extra: null
            }
          ]
        });
      }
    });
    if (!environment.production) {
      LocalNotifications.schedule({
        notifications: [
          {
            title: 'Dwell ' + event.name,
            body: geofence.action + ' ' + event.name,
            id: parseInt(event.id, 10),
            schedule: { at: new Date(Date.now()) },
            sound: 'beep.aiff',
            attachments: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    }
  }

  private async exitedEventGeofence(event: Event, geofence: GeofenceEvent) {
    await this.exitedEventGeofenceService.mutate({ eventId: event.id }).toPromise().catch(err => {
      if (!environment.production) {
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'Geofence error',
              body: JSON.stringify(err),
              id: parseInt(event.id, 10),
              schedule: { at: new Date(Date.now()) },
              sound: 'beep.aiff',
              attachments: null,
              actionTypeId: '',
              extra: null
            }
          ]
        });
      }
    });
    if (!environment.production) {
      LocalNotifications.schedule({
        notifications: [
          {
            title: 'Exited ' + event.name,
            body: geofence.action + ' ' + event.name,
            id: parseInt(event.id, 10),
            schedule: { at: new Date(Date.now()) },
            sound: 'beep.aiff',
            attachments: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    }
  }

}