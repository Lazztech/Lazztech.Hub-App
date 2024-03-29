import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import {
  Exact,
  PaginatedInAppNotifcationsQueryVariables,
  PaginatedInAppNotifcationsQuery,
  InAppNotification,
} from 'src/graphql/graphql';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { cache } from '../../graphql.module';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, OnDestroy {
  loading = true;
  getInAppNotficationsQueryRef: QueryRef<
    PaginatedInAppNotifcationsQuery,
    Exact<{
      limit: number;
      offset: number;
      field: string;
      ascending: boolean;
    }>
  >;
  subscriptions: Subscription[] = [];
  pageableOptions: PaginatedInAppNotifcationsQueryVariables;
  InAppNotifications: Array<InAppNotification> = [];

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(
    private notificationsService: NotificationsService,
    private logger: NGXLogger,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.pageableOptions = {
      limit: 20,
      offset: 0,
      field: 'date',
      ascending: false,
    };
    this.getInAppNotficationsQueryRef =
      this.notificationsService.getInAppNotficationsPaginated(
        this.pageableOptions
      );
    this.subscriptions.push(
      this.getInAppNotficationsQueryRef.valueChanges.subscribe((result) => {
        this.logger.log('loading:', result.loading);
        this.loading = result.loading;
        this.InAppNotifications =
          result?.data?.paginatedInAppNotifications.items;
      })
    );
  }

  loadData(event) {
    this.loadMore().then((x) => {
      this.InAppNotifications = this.InAppNotifications.concat(
        x?.data?.paginatedInAppNotifications.items
      );
      event.target.complete();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  loadMore() {
    return this.getInAppNotficationsQueryRef.fetchMore({
      variables: {
        ...this.pageableOptions,
        offset: this.InAppNotifications.length,
      },
      // FIXME: broken from apollo v2 -> v3 migration, though in app notifications aren't geing used so this is dead code for now.
      // updateQuery: (previousResult, { fetchMoreResult }) => {
      //   if (!fetchMoreResult?.paginatedInAppNotifications.items.length) {
      //     this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
      //     return previousResult;
      //   }
      // },
    });
  }

  clearCache() {
    cache.evict({ __typename: 'InAppNotification' } as InAppNotification);
    cache.gc();
  }
  async doRefresh(event) {
    try {
      this.infiniteScroll.disabled = false;
      this.clearCache();
      this.InAppNotifications = (
        await this.getInAppNotficationsQueryRef.refetch(this.pageableOptions)
      ).data.paginatedInAppNotifications.items;
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

  async deleteNotification(notification: InAppNotification) {
    await this.notificationsService.deleteInAppNotification(notification.id);
    this.InAppNotifications.splice(
      this.InAppNotifications.indexOf(notification),
      1
    );
  }

  async handleNotificationActionLink(actionLink: string) {
    this.navController.navigateForward(actionLink);
  }
}
