import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Storage } from '@ionic/storage-angular';
import { NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { AddUserWebPushNotificationSubscriptionGQL } from 'src/graphql/graphql';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  swPushpayload: any;

  constructor(
    private readonly logger: NGXLogger,
    private swPush: SwPush,
    private storage: Storage,
    private addUserWebPushNotificationSubscriptionGQLService: AddUserWebPushNotificationSubscriptionGQL,
  ) {}

  subscribeToNotifications(): void {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: environment.webPushPublicVapidKey
        })
        .then(async (sub: PushSubscription) => {
          // Save the subscription object to your server
          await this.saveSubscription(sub);

          // Store the subscription in local storage or any other storage mechanism
          await this.storeSubscription(sub);

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

  private async saveSubscription(sub: PushSubscription) {
    // Send the subscription object to your server for storing
    // You can make an HTTP request or use any other method to send the subscription data to your server
    const result = await this.addUserWebPushNotificationSubscriptionGQLService.mutate({
      subscription: sub
    }).toPromise();

    const response = result.data.addUserWebPushNotificationSubscription;

    if (response) {
      this.logger.log('editHub successful.');
    } else {
      this.logger.log('editHub failure');
    }

    return response;
  }

  private async storeSubscription(sub: PushSubscription) {
    // Store the subscription in local storage or any other storage mechanism
    await this.storage.set('webPushSubcription', sub);
  }
}
