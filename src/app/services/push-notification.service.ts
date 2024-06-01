import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  swPushpayload: any;

  constructor(private swPush: SwPush) {}

  subscribeToNotifications(): void {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: environment.webPushPublicVapidKey
        })
        .then((sub: PushSubscription) => {
          // Save the subscription object to your server
          this.saveSubscription(sub);

          // Store the subscription in local storage or any other storage mechanism
          this.storeSubscription(sub);

          console.log('Display', JSON.stringify(sub)); // This will be required for the Nest.js backend to send notifications
        })
        .catch((err: any) => console.error('Could not subscribe to notifications', err));
    }
  }

  unsubscribeFromPushNotifications(): void {
    this.swPush
      .unsubscribe()
      .then(() => {
        console.log('Unsubscribed from push notifications.');
      })
      .catch(error => {
        console.error('Error unsubscribing from push notifications:', error);
      });
  }

  subscribeMessage(): void {
    this.swPush.messages.subscribe((res: any) => {
      console.log('Received push notification', res);
    });
  }

  private saveSubscription(sub: PushSubscription): void {
    // Send the subscription object to your server for storing
    // You can make an HTTP request or use any other method to send the subscription data to your server
  }

  private storeSubscription(sub: PushSubscription): void {
    // Store the subscription in local storage or any other storage mechanism
  }
}
