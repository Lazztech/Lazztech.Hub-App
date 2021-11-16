import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import {
  GetInAppNotificationsQuery,
  Exact,
  PaginatedInAppNotifcationsQueryVariables,
  PaginatedInAppNotifcationsQuery,
} from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';

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
  InAppNotifications: GetInAppNotificationsQuery['getInAppNotifications'] = [];

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
    console.log(this.InAppNotifications);
  }

  loadData(event) {
    this.loadMore().then((x) => {
      this.InAppNotifications = this.InAppNotifications.concat(
        x?.data?.paginatedInAppNotifications.items
      );
      event.target.complete();
    });
    console.log(this.InAppNotifications);
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
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.paginatedInAppNotifications.items.length) {
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
          return previousResult;
        }
        Object.assign({}, previousResult, {
          feed: [
            ...previousResult?.paginatedInAppNotifications.items,
            ...fetchMoreResult?.paginatedInAppNotifications.items,
          ],
        });
      },
    });
  }

  async doRefresh(event) {
    try {
      this.infiniteScroll.disabled = false;
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

  async deleteNotification(id: any) {
    await this.notificationsService.deleteInAppNotification(id);
  }

  async handleNotificationActionLink(actionLink: string) {
    this.navController.navigateForward(actionLink);
  }
}
