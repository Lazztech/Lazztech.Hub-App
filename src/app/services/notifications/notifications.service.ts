import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import '@firebase/messaging';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NGXLogger } from 'ngx-logger';
import {
  AddUserFcmNotificationTokenGQL,
  DeleteAllInAppNotificationsGQL,
  DeleteInAppNotificationGQL,
  InAppNotification,
  PaginatedInAppNotifcationsGQL,
  PaginatedInAppNotifcationsQueryVariables,
  Scalars,
} from '../../../graphql/graphql';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private platform: Platform,
    private storage: Storage,
    private alertService: AlertService,
    private deleteAllInAppNotificationsGQLService: DeleteAllInAppNotificationsGQL,
    private deleteInAppNotificationGQLService: DeleteInAppNotificationGQL,
    private addUserFcmNotificationTokenGQLService: AddUserFcmNotificationTokenGQL,
    private paginatedInAppNotficationsGQLService: PaginatedInAppNotifcationsGQL,
    private logger: NGXLogger,
    private navController: NavController
  ) {}

  async localNotification(
    title: string,
    body: string,
    schedule?: Date
  ): Promise<void> {
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
          extra: null,
        },
      ],
    });
  }

  getInAppNotficationsPaginated(
    pageableOptions: PaginatedInAppNotifcationsQueryVariables
  ) {
    return this.paginatedInAppNotficationsGQLService.watch(pageableOptions);
  }

  async deleteInAppNotification(inAppNotificationId: Scalars['ID']) {
    const result = await this.deleteInAppNotificationGQLService
      .mutate(
        {
          inAppNotificationId,
        },
        {
          update: (cache, mutationResult) => {
            const normalizedId = cache.identify({
              id: inAppNotificationId,
              __typename: 'InAppNotification',
            } as InAppNotification);
            cache.evict({ id: normalizedId });
            cache.gc();
          },
        }
      )
      .toPromise();

    if (result.data.deleteInAppNotification) {
      this.logger.log('deleteInAppNotification successful.');
      return true;
    } else {
      this.logger.error('deleteInAppNotification failed!');
      return false;
    }
  }

  async deleteAllInAppNotifications() {
    const result = await this.deleteAllInAppNotificationsGQLService
      .mutate(null, {
        update: (cache, mutationResult) => {
          cache.evict({ __typename: 'InAppNotification' } as InAppNotification);
          cache.gc();
        },
      })
      .toPromise();

    if (result.data.deleteAllInAppNotifications) {
      this.logger.log('deleteAllInAppNotifications successful.');
    } else {
      this.logger.error('deleteAllInAppNotifications failed!');
    }
  }

  async setupPushNotifications() {
    if (this.platform.is("capacitor")) {
      // FOR iOS & ANDROID
      this.logger.log('Setting up iOS/Android native push notifications.');

      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      await PushNotifications.requestPermissions().then(result => {
        console.log('PushNotifications.requestPermissions result: ', result);
        
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      // TODO Remove?
      // const nativePushToken = await this.storage.get('native-push-token');
      // if (nativePushToken) {
      //   await this.submitNotificationToken(nativePushToken);
      // }

      await PushNotifications.addListener('registration', async (token: Token) => {
        await this.storage.set('native-push-token', token.value);
        await this.submitNotificationToken(token.value);

        console.log('Push registration success, token: ', token.value);
        // alert('Push registration success, token: ' + token.value);
      });

      await PushNotifications.addListener('registrationError', (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
        this.logger.error('Error on registration: ' + JSON.stringify(error));
      });

      await PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: PushNotificationSchema) => {
          this.logger.log('Push received: ' + JSON.stringify(notification));
          await this.alertService.create({
            header: notification.title,
            message: notification.body,
            duration: 3000,
            position: 'top',
            translucent: true,
          });
        }
      );

      await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notificationActionDetails: ActionPerformed) => {
          this.logger.log(
            'Push action performed: ' + JSON.stringify(notificationActionDetails)
          );
          if (notificationActionDetails.notification?.data?.aps?.category) {
            this.navController.navigateForward(
              notificationActionDetails.notification.data.aps.category
            );
          }
        }
      );
    }
  }

  private async submitNotificationToken(token: string) {
    const result = await this.addUserFcmNotificationTokenGQLService
      .mutate({
        token,
      })
      .toPromise();

    if ((result as any).data.addUserFcmNotificationToken) {
      this.logger.log('addUserFcmNotificationToken successful.');
    } else {
      this.logger.error('addUserFcmNotificationToken failed!');
    }
  }

  public async getNativePushNotificationToken() {
    return await this.storage.get('native-push-token');
  }
}
