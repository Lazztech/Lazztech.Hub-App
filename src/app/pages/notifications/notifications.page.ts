import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import {
  InAppNotification,
  GetInAppNotificationsQuery,
  Exact,
} from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, OnDestroy {
  loading = true;

  queryRef: QueryRef<
    GetInAppNotificationsQuery,
    Exact<{
      limit?: number;
      offset?: number;
    }>
  >;
  subscriptions: Subscription[] = [];
  limit = 10;
  offset = 0;
  sortedInAppNotifications: GetInAppNotificationsQuery['getInAppNotifications'] =
    [];
  constructor(
    private notificationsService: NotificationsService,
    private logger: NGXLogger,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.queryRef = this.notificationsService.watchGetInAppNotifications(
      this.limit,
      this.offset,
      null,
      1000
    );

    this.subscriptions.push(
      this.queryRef.valueChanges.subscribe((result) => {
        this.logger.log('loading: ', result.loading);
        this.loading = result.loading;
        const combinedResults = this.sortedInAppNotifications.concat(
          result?.data?.getInAppNotifications
        );
        this.sortedInAppNotifications = this.sortNotifications(combinedResults);
      })
    );
  }

  loadData(event) {
    this.loadMore().then((x) => {
      const data = x?.data?.getInAppNotifications;
      this.sortedInAppNotifications = this.sortNotifications(
        this.sortedInAppNotifications.concat(data)
      );
      event.target.complete();
    });
    console.log(this.sortedInAppNotifications.length);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  sortNotifications(notifications: InAppNotification[]) {
    const sorted = notifications.sort((x, y) => {
      return parseInt(y.date, 10) - parseInt(x.date, 10);
    });
    return sorted;
  }

  loadMore() {
    return this.queryRef.fetchMore({
      variables: {
        offset: this.sortedInAppNotifications.length,
        limit: this.limit,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        Object.assign({}, previousResult, {
          feed: [
            ...previousResult.getInAppNotifications,
            ...fetchMoreResult.getInAppNotifications,
          ],
        });
      },
    });
  }

  async doRefresh(event) {
    try {
      this.sortedInAppNotifications = this.sortNotifications(
        (await this.queryRef.refetch({ limit: this.limit, offset: 0 })).data
          ?.getInAppNotifications
      );
      // let moreNotifications = (await this.loadMore()).data
      //   ?.getInAppNotifications;
      // this.sortedInAppNotifications = this.sortNotifications(
      //   this.sortedInAppNotifications.concat(moreNotifications)
      // );
      this.loading = false;
      event.target.complete();
    } catch (error) {
      event.target.complete();
      this.loading = false;
    }
  }

  async deleteNotifications() {
    const result = confirm('Delete all notifications?');
    if (result) {
      await this.notificationsService.deleteAllInAppNotifications();
    }
  }

  async deleteNotification(id: any) {
    await this.notificationsService.deleteInAppNotification(id);
  }

  async handleNotificationActionLink(actionLink: string) {
    this.navController.navigateForward(actionLink);
  }
}
