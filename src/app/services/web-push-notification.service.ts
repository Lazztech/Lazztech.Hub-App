import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Storage } from '@ionic/storage-angular';
import { NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { AddUserWebPushNotificationSubscriptionGQL } from 'src/graphql/graphql';
import { AlertService } from './alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class WebPushNotificationService {
  swPushpayload: any;

  constructor(
    private readonly logger: NGXLogger,
    private swPush: SwPush,
    private storage: Storage,
    private addUserWebPushNotificationSubscriptionGQLService: AddUserWebPushNotificationSubscriptionGQL,
    private alertService: AlertService,
  ) {}

  subscribeToNotifications(): void {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: environment.webPushPublicVapidKey
        })
        .then(async (sub: PushSubscription) => {
          console.log('Web PushSubscription: ', sub);

          // Save the subscription object to your server
          await this.saveSubscription(sub);
          // Store the subscription in local storage or any other storage mechanism
          await this.storeSubscription(sub);
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
    this.swPush.messages.subscribe(async (res: any) => {
      console.log('Received push notification', res);
      await this.alertService.create({
        header: res?.notification?.title,
        message: res?.notification?.body,
        duration: 4000,
        position: 'top',
        translucent: true,
      });
    });
  }

  private async saveSubscription(sub: PushSubscription) {
    // Send the subscription object to your server for storing
    // You can make an HTTP request or use any other method to send the subscription data to your server
    return await this.addUserWebPushNotificationSubscriptionGQLService.mutate({
      subscription: sub
    }).toPromise();
  }

  private async storeSubscription(sub: PushSubscription) {
    // Store the subscription in local storage or any other storage mechanism
    await this.storage.set('webPushSubcription', JSON.stringify(sub));
  }
}
