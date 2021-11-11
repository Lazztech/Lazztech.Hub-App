import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { NotificationsService } from "src/app/services/notifications/notifications.service";
import {
  InAppNotification,
  GetInAppNotificationsQuery,
  Exact,
} from "src/generated/graphql";
import { NGXLogger } from "ngx-logger";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { IonInfiniteScroll, NavController } from "@ionic/angular";
import { QueryRef } from "apollo-angular";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
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
  sortedInAppNotifications: GetInAppNotificationsQuery["getInAppNotifications"] =
    [];
  isfucked: boolean;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(
    private notificationsService: NotificationsService,
    private logger: NGXLogger,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.queryRef = this.notificationsService.watchGetInAppNotifications(
      this.limit,
      this.offset,
      null
    );

    this.subscriptions.push(
      this.queryRef.valueChanges.subscribe((result) => {
        this.logger.log("loading: ", result.loading);
        this.loading = result.loading;
        this.sortedInAppNotifications = this.sortNotifications(
          result?.data?.getInAppNotifications
        );
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
    console.log(this.sortedInAppNotifications);
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
    this.offset = this.sortedInAppNotifications.length;
    console.log(this.offset);
    return this.queryRef.fetchMore({
      variables: {
        offset: this.sortedInAppNotifications.length,
        limit: this.limit,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult.getInAppNotifications.length) {
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
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
      console.log(this.offset);
      this.infiniteScroll.disabled = false;
      this.sortedInAppNotifications = this.sortNotifications(
        (
          await this.queryRef.refetch({
            limit: this.limit,
            offset: this.offset - this.limit,
          })
        ).data?.getInAppNotifications
      );
      console.log(this.sortedInAppNotifications);
      this.loading = false;
      event.target.complete();
    } catch (error) {
      event.target.complete();
      this.loading = false;
    }
  }

  async deleteNotifications() {
    const result = confirm("Delete all notifications?");
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
