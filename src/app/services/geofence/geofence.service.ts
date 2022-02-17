import { Injectable } from '@angular/core';
import BackgroundGeolocation, {
  GeofenceEvent
} from '@transistorsoft/capacitor-background-geolocation';
import { NGXLogger } from 'ngx-logger';
import { Hub } from 'src/generated/graphql';
import { environment } from '../../../environments/environment';
import { HubService } from '../hub/hub.service';
import { LocalNotifications } from '@capacitor/local-notifications';

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

  async refreshHubGeofences() {
    await this.removeAllGeofences();
    const userHubs = await this.hubService.usersHubs();
    for (const userHub of userHubs) {
      const hub = userHub.hub;
      const identifier = {
        id: hub.id,
        name: hub.name
      };
      await this.addGeofence({
        identifier: JSON.stringify(identifier),
        latitude: hub.latitude,
        longitude: hub.longitude,
      });

      this.logger.log(`Added geofence for ${JSON.stringify(hub)}`);
    }
  }

  async isPowerSaveMode() {
    // FIXME: seems to always return false
    return await BackgroundGeolocation.isPowerSaveMode();
  }

  async configureBackgroundGeolocation() {
    BackgroundGeolocation.onGeofence(async geofence => {
      this.logger.log('[geofence] ', geofence.identifier, geofence.action);

      // Perform some long-running task (eg: HTTP request)
      BackgroundGeolocation.startBackgroundTask().then(async (taskId) => {
        const hub = JSON.parse(geofence.identifier) as Hub;

        if (geofence.action === 'ENTER') {
          await this.enteredGeofence(hub, geofence).catch(error => {
            // Be sure to catch errors:  never leave you background-task hanging.
            this.logger.error(error);
            BackgroundGeolocation.stopBackgroundTask(taskId);
          });
        } else if (geofence.action === 'EXIT') {
          await this.exitedGeofence(hub, geofence).catch(error => {
            // Be sure to catch errors:  never leave you background-task hanging.
            this.logger.error(error);
            BackgroundGeolocation.stopBackgroundTask(taskId);
          });
        } else if (geofence.action == "DWELL") {
          this.dwellGeofence(hub, geofence).catch(error => {
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
    return await BackgroundGeolocation.getState();
  }

  private async exitedGeofence(hub: Hub, geofence: GeofenceEvent) {
    await this.hubService.exitedHubGeofence(hub.id).catch(err => {
      // LocalNotifications.schedule({
      //   notifications: [
      //     {
      //       title: 'Geofence error',
      //       body: JSON.stringify(err),
      //       id: parseInt(hub.id, 10),
      //       schedule: { at: new Date(Date.now()) },
      //       sound: 'beep.aiff',
      //       attachments: null,
      //       actionTypeId: '',
      //       extra: null
      //     }
      //   ]
      // });
    });
    // LocalNotifications.schedule({
    //   notifications: [
    //     {
    //       title: 'Exited ' + hub.name,
    //       body: geofence.action + ' ' + hub.name,
    //       id: parseInt(hub.id, 10),
    //       schedule: { at: new Date(Date.now()) },
    //       sound: 'beep.aiff',
    //       attachments: null,
    //       actionTypeId: '',
    //       extra: null
    //     }
    //   ]
    // });
  }

  private async dwellGeofence(hub: Hub, geofence: GeofenceEvent) {
    await this.hubService.dwellHubGeofence(hub.id).catch(err => {
      // LocalNotifications.schedule({
      //   notifications: [
      //     {
      //       title: 'Geofence error',
      //       body: JSON.stringify(err),
      //       id: parseInt(hub.id, 10),
      //       schedule: { at: new Date(Date.now()) },
      //       sound: 'beep.aiff',
      //       attachments: null,
      //       actionTypeId: '',
      //       extra: null
      //     }
      //   ]
      // });
    });
    // LocalNotifications.schedule({
    //   notifications: [
    //     {
    //       title: 'Dwell ' + hub.name,
    //       body: geofence.action + ' ' + hub.name,
    //       id: parseInt(hub.id, 10),
    //       schedule: { at: new Date(Date.now()) },
    //       sound: 'beep.aiff',
    //       attachments: null,
    //       actionTypeId: '',
    //       extra: null
    //     }
    //   ]
    // });
  }

  private async enteredGeofence(hub: Hub, geofence: GeofenceEvent) {
    await this.hubService.enteredHubGeofence(hub.id).catch(err => {
      // LocalNotifications.schedule({
      //   notifications: [
      //     {
      //       title: 'Geofence error',
      //       body: JSON.stringify(err),
      //       id: parseInt(hub.id, 10),
      //       schedule: { at: new Date(Date.now()) },
      //       sound: 'beep.aiff',
      //       attachments: null,
      //       actionTypeId: '',
      //       extra: null,
      //     }
      //   ]
      // });
    });
    // LocalNotifications.schedule({
    //   notifications: [
    //     {
    //       title: 'Entered ' + hub.name,
    //       body: geofence.action + ' ' + hub.name,
    //       id: parseInt(hub.id, 10),
    //       schedule: { at: new Date(Date.now()) },
    //       sound: 'beep.aiff',
    //       attachments: null,
    //       actionTypeId: '',
    //       extra: null
    //     }
    //   ]
    // });
  }
}