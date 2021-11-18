import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import '@firebase/messaging';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FetchPolicy } from 'apollo-client';
import { NGXLogger } from 'ngx-logger';
import {
  AddUserFcmNotificationTokenGQL,
  DeleteAllInAppNotificationsGQL,
  DeleteInAppNotificationGQL,
  GetInAppNotificationsDocument,
  GetInAppNotificationsGQL,
  GetInAppNotificationsQuery,
  InAppNotification,
  PaginatedInAppNotifcationsGQL,
  PaginatedInAppNotifcationsDocument,
  PaginatedInAppNotifcationsQueryVariables,
  Scalars,
  PaginatedInAppNotifcationsQuery,
} from '../../../generated/graphql';

@Injectable({
  providedIn: 'root',
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

  watchGetInAppNotifications(
    limit?: number,
    offset?: number,
    fetchPolicy: FetchPolicy = 'cache-first',
    pollInterval = 0
  ) {
    return this.getInAppNotificationsGQLService.watch(
      null,

      {
        pollInterval,
        fetchPolicy,
      }
    );
  }

  async getInAppNotifications(
    limit?: number,
    offset?: number,
    fetchPolicy: FetchPolicy = 'cache-first'
  ): Promise<InAppNotification[]> {
    const result = await this.getInAppNotificationsGQLService
      .fetch(null, {
        fetchPolicy,
      })
      .toPromise();

    this.logger.log(result);
    return result.data.getInAppNotifications;
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
    // FOR iOS & ANDROID
    this.logger.log('Setting up iOS/Android native push notifications.');

    PushNotifications.register();

    // TODO Remove?
    // const nativePushToken = await this.storage.get('native-push-token');
    // if (nativePushToken) {
    //   await this.submitNotificationToken(nativePushToken);
    // }

    PushNotifications.addListener('registration', async (token: Token) => {
      await this.storage.set('native-push-token', token.value);
      await this.submitNotificationToken(token.value);

      // alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
      this.logger.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
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
                  this.navController.navigateForward(
                    notification.data.aps.category
                  );
                }
                this.logger.log('View clicked');
              },
            },
          ],
        });
        this.logger.log('presenting toast');
        await toast.present();
      }
    );

    PushNotifications.addListener(
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
