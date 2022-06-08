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

  requestUber(
    userLocation: { latitude?: any, longitude?: any },
    destination: { latitude?: any, longitude?: any },
    destinationName: string,
  ) {
    // tslint:disable-next-line:max-line-length
    window.open(`uber://?client_id=<CLIENT_ID>&action=setPickup&pickup[latitude]=${userLocation.latitude}&pickup[longitude]=${userLocation.longitude}&pickup[nickname]=Your%20Location&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=${destination.latitude}&dropoff[longitude]=${destination.longitude}&dropoff[nickname]=${destinationName}%20Hub&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383`);
  }
}
