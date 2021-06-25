import { Injectable } from '@angular/core';
import { Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken } from '@capacitor/core';
import { firebase } from '@firebase/app';
import '@firebase/messaging';
import { Platform, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FetchPolicy } from 'apollo-client';
import {
  AddUserFcmNotificationTokenGQL,
  DeleteAllInAppNotificationsGQL,
  DeleteInAppNotificationGQL,
  GetInAppNotificationsGQL,
  InAppNotification,
  Scalars,
  GetInAppNotificationsDocument,
  GetInAppNotificationsQuery
} from '../../../generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';
const { LocalNotifications, PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private platform: Platform,
    private storage: Storage,
    private toastController: ToastController,
    private deleteAllInAppNotificationsGQLService: DeleteAllInAppNotificationsGQL,
    private getInAppNotificationsGQLService: GetInAppNotificationsGQL,
    private deleteInAppNotificationGQLService: DeleteInAppNotificationGQL,
    private addUserFcmNotificationTokenGQLService: AddUserFcmNotificationTokenGQL,
    private logger: NGXLogger,
    private navController: NavController
  ) { }

  async localNotification(title: string, body: string, schedule?: Date): Promise<void> {
    const result = await LocalNotifications.areEnabled();
    if (!result.value) {
      LocalNotifications.requestPermissions();
    }

    if (!schedule) {
      schedule = new Date(Date.now());
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: 1,
          // schedule: { at: new Date(Date.now() + 1000 * 5) },
          schedule: { at: schedule },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  }

  watchGetInAppNotifications(fetchPolicy: FetchPolicy = 'cache-first') {
    return this.getInAppNotificationsGQLService.watch(
      null,
      {
        fetchPolicy
      }
    );
  }

  async getInAppNotifications(fetchPolicy: FetchPolicy = 'cache-first'): Promise<InAppNotification[]> {
    const result = await this.getInAppNotificationsGQLService.fetch(
      null,
      {
        fetchPolicy
      }
    ).toPromise();

    this.logger.log(result);
    return result.data.getInAppNotifications;
  }

  async deleteInAppNotification(inAppNotificationId: Scalars['ID']) {
    const result = await this.deleteInAppNotificationGQLService.mutate({
      inAppNotificationId
    },
    {
      update: (proxy, { data: { deleteInAppNotification } }) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: GetInAppNotificationsDocument }) as GetInAppNotificationsQuery;

        // Find out notification by id and splice to remove it.
        const notification = data.getInAppNotifications.find(x => x.id === inAppNotificationId);
        data.getInAppNotifications.splice(data.getInAppNotifications.indexOf(notification), 1);

        // Write our data back to the cache.
        proxy.writeQuery({ query: GetInAppNotificationsDocument, data });
      },
    }
    ).toPromise();

    if (result.data.deleteInAppNotification) {
      this.logger.log('deleteInAppNotification successful.');
      return true;
    } else {
      this.logger.error('deleteInAppNotification failed!');
      return false;
    }
  }

  async deleteAllInAppNotifications() {
    const result = await this.deleteAllInAppNotificationsGQLService.mutate(null, {
      update: (proxy, { data: { deleteAllInAppNotifications } }) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: GetInAppNotificationsDocument }) as GetInAppNotificationsQuery;

        // Clear out notifications.
        data.getInAppNotifications = [];

        // Write our data back to the cache.
        proxy.writeQuery({ query: GetInAppNotificationsDocument, data });
      },
    }).toPromise();

    if (result.data.deleteAllInAppNotifications) {
      this.logger.log('deleteAllInAppNotifications successful.');
    } else {
      this.logger.error('deleteAllInAppNotifications failed!');
    }
  }

  async setupPushForAllPlatforms() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      await this.setupPushiOSAndAndroid();
    }
  }

  async setupPushiOSAndAndroid() {
    // FOR iOS & ANDROID
    this.logger.log('Setting up iOS/Android native push notifications.');

    PushNotifications.register();

    // TODO Remove?
    // const nativePushToken = await this.storage.get('native-push-token');
    // if (nativePushToken) {
    //   await this.submitNotificationToken(nativePushToken);
    // }

    PushNotifications.addListener('registration',
      async (token: PushNotificationToken) => {
        await this.storage.set('native-push-token', token.value);
        await this.submitNotificationToken(token.value);

        // alert('Push registration success, token: ' + token.value);
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
        this.logger.error('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
      async (notification: PushNotification) => {
        this.logger.log('Push received: ' + JSON.stringify(notification));
        // TODO move to alertService?
        const toast = await this.toastController.create({
          header: notification.title,
          message: notification.body,
          duration: 3000,
          position: 'top',
          color: 'dark',
          translucent: true,
          buttons: [
            {
              side: 'start',
              text: 'View',
              handler: () => {
                if (notification?.data?.aps?.category) {
                  this.navController.navigateForward(notification.data.aps.category);
                }
                this.logger.log('View clicked');
              }
            },
          ]
        });
        this.logger.log('presenting toast');
        await toast.present();
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notificationActionDetails: PushNotificationActionPerformed) => {
        this.logger.log('Push action performed: ' + JSON.stringify(notificationActionDetails));
        if (notificationActionDetails.notification?.data?.aps?.category) {
          this.navController.navigateForward(notificationActionDetails.notification.data.aps.category);
        }
      }
    );
  }

  private async submitNotificationToken(token: string) {
    const result = await this.addUserFcmNotificationTokenGQLService.mutate({
      token
    }).toPromise();

    if ((result as any).data.addUserFcmNotificationToken) {
      this.logger.log('addUserFcmNotificationToken successful.');
    } else {
      this.logger.error('addUserFcmNotificationToken failed!');
    }
  }

}
