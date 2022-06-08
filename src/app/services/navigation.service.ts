import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  platform = Capacitor.getPlatform();

  constructor(
    private logger: NGXLogger
  ) { }

  navigate(
    userLocation: { latitude?: any, longitude?: any },
    destination: { latitude?: any, longitude?: any }
  ) {
    // tslint:disable-next-line:max-line-length
    const appleMaps = `http://maps.apple.com/?saddr=${userLocation.latitude},${userLocation.longitude}&daddr=${destination.latitude},${destination.longitude}&dirflg=d`;
    // tslint:disable-next-line:max-line-length
    const googleMaps = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${destination.latitude},${destination.longitude}`;
    
    if (this.platform === 'android') {
      window.open(googleMaps);
    } else {
      window.open(appleMaps);
    }
  }
}
