import { Injectable } from '@angular/core';
import * as geolib from 'geolib';
import { NGXLogger } from 'ngx-logger';
import { Observable, Observer, of } from 'rxjs';
import { Hub } from 'src/generated/graphql';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from '../../../environments/environment';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  /**
   * observable stream of users current location
   */
  coords$: Observable<{ latitude: number, longitude: number }>;

  constructor(
    private logger: NGXLogger
  ) {
    this.coords$ = this.watchLocation();
   }

  atHub(hub: any, coords: any, distance: number = environment.geofenceRadius) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };
    const result = geolib.isPointWithinRadius(
      coords,
      hubCoords,
      distance
    );
    return result;
  }

  getCurrentPosition() {
    return Geolocation.getCurrentPosition();
  }

  private watchLocation(minuteInterval: number = 1): Observable<{ latitude: number, longitude: number}> {
    if (environment.demoMode) {
      this.logger.log('returning demo data for users location');
      return of(environment.demoData.usersLocation);
    } else {
      const result = Observable.create(
        (observer: Observer<{ latitude: number, longitude: number}>) => {
          const id = Geolocation.watchPosition({ enableHighAccuracy: true }, (x: GeolocationPosition, err) => {
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

  getDistanceFromHub(hub: Hub, coords: any) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };
    const distance = geolib.getDistance(
      coords,
      hubCoords
    );
    this.logger.log(`distanceInMeters from hubId ${hub.id}: ` + distance);
    return distance;
  }


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
