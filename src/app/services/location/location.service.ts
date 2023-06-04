import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import * as geolib from 'geolib';
import { NGXLogger } from 'ngx-logger';
import { Observable, Observer, of } from 'rxjs';
import { Hub } from 'src/graphql/graphql';
import { environment } from '../../../environments/environment';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public position: Position;
  /**
   * @deprecated use position instead
   */
  public location: { latitude: number, longitude: number };
  private watchId: string;

  constructor(
    private logger: NGXLogger,
    private errorService: ErrorService,
  ) {}

  atLocation(location: { latitude?: number, longitude?: number }, userCoords: any, distance: number = environment.geofenceRadius): boolean {
    if (location?.latitude && location?.longitude) {
      return geolib.isPointWithinRadius(
        userCoords,
        { latitude: location?.latitude, longitude: location?.longitude },
        distance
      );
    }
    return false;
  }

  getCurrentPosition() {
    return Geolocation.getCurrentPosition();
  }

  async watchPosition(
    callback?: (location: { latitude: number, longitude: number }) => Promise<void> | void,
    options: PositionOptions = { enableHighAccuracy: true }
  ) {
    if (environment.demoMode) {
      this.logger.log('returning demo data for users location');
      this.location = (environment.demoData.usersLocation);
      return;
    }
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = undefined;
    }
    this.watchId = await Geolocation.watchPosition(options, async (position, err) => {
      if (err) {
        this.errorService.handleError(err);
        return;
      }
      this.position = position;
      this.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      if (callback) {
        await callback(this.location);
      }
    });
  }

  getDistanceFromHub(hub: Hub, coords: any) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };
    const distance = geolib.getDistance(
      coords,
      hubCoords
    );
    return distance;
  }

  getMilesFromMeters(meters: number): number {
    return meters*0.000621371192;
  }

  /**
   * @deprecated The method should not be used
   */
  private watchLocation(minuteInterval: number = 1): Observable<{ latitude: number, longitude: number}> {
    if (environment.demoMode) {
      this.logger.log('returning demo data for users location');
      return of(environment.demoData.usersLocation);
    } else {
      const result = Observable.create(
        async (observer: Observer<{ latitude: number, longitude: number}>) => {
          const id = await Geolocation.watchPosition({ enableHighAccuracy: true }, (x: GeolocationPosition, err) => {
          // Geolocation.clearWatch({id});
          if (err) {
            this.logger.log(err);
            // observer.complete();
          }
          const coords = { latitude: x.coords.latitude, longitude: x.coords.longitude };
          observer.next(coords);
        });
      });

      return result;
    }
  }


  /**
   * @deprecated The method should not be used
   */
  getCurrentPositionFastIos = async (options: PositionOptions = {}): Promise<GeolocationPosition> => {
    return new Promise<GeolocationPosition>(async (resolve, reject) => {
      const id = await Geolocation.watchPosition(options, (position, err) => {
        Geolocation.clearWatch({id});
        if (err) {
          reject(err);
          return;
        }
        resolve(position);
      });
    });
  }

}
