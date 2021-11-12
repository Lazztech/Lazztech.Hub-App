import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { NotificationsService } from "src/app/services/notifications/notifications.service";
import {
  InAppNotification,
  GetInAppNotificationsQuery,
  Exact,
} from "src/generated/graphql";
import { NGXLogger } from "ngx-logger";
import { Subscription } from "rxjs";
import { IonInfiniteScroll, NavController } from "@ionic/angular";
import { QueryRef } from "apollo-angular";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
})
export class NotificationsPage implements OnInit, OnDestroy {
  loading = true;
  getInAppNotficationsQueryRef: QueryRef<
    GetInAppNotificationsQuery,
    Exact<{
      limit?: number;
      offset?: number;
    }>
  >;
  // getInAppNotficationsQueryRefcount: QueryRef<
  //   GetInAppNotificationsCountQuery,
  //   Exact<{
  //     [key: string]: never;
  //   }>
  // >;
  subscriptions: Subscription[] = [];
  limit = 20;
  offset = 0;
  count: number;
  sortedInAppNotifications: GetInAppNotificationsQuery["getInAppNotifications"] =
    [];

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(
    private notificationsService: NotificationsService,
    private logger: NGXLogger,
    private navController: NavController
  ) {}

  ngOnInit() {
    // this.getInAppNotficationsQueryRefcount =
    //   this.notificationsService.getInAppNotficationsCount();
    // this.getInAppNotficationsQueryRefcount.valueChanges
    //   .pipe(
    //     map((result) => {
    //       this.getInAppNotficationsQueryRef =
    //         this.notificationsService.watchGetInAppNotifications(
    //           this.limit,
    //           result?.data?.getInAppNotificationsCount - this.limit
    //         );
    //       this.count = result?.data?.getInAppNotificationsCount;
    //       this.offset = result?.data?.getInAppNotificationsCount;
    //       return this.getInAppNotficationsQueryRef;
    //     })
    //   )
    //   .subscribe((x) => {
    //     this.subscriptions.push(
    //       this.getInAppNotficationsQueryRef.valueChanges.subscribe((result) => {
    //         this.logger.log("loading: ", result.loading);
    //         this.loading = result.loading;
    //         this.sortedInAppNotifications = this.sortNotifications(
    //           result?.data?.getInAppNotifications
    //         );
    //       })
    //     );
    //   });
    // // this.notificationsService
    // //   .getInAppNotficationsCount()
    // //   .toPromise()
    // //   .then((x) => (this.count = x?.data?.getInAppNotificationsCount));
  }

  loadData(event) {
    this.loadMore().then((x) => {
      const data = x?.data?.getInAppNotifications;
      this.sortedInAppNotifications = this.sortNotifications(
        this.sortedInAppNotifications.concat(data)
      );
      event.target.complete();
    });
    if (this.offset === 0) {
      event.target.disabled = true;
    }
    console.log(this.count);
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
    return this.getInAppNotficationsQueryRef.fetchMore({
      variables: {
        offset: this.sortedInAppNotifications.length,
        limit: this.limit,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
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
    console.log(this.sortedInAppNotifications);
    try {
      console.log(this.offset);
      this.infiniteScroll.disabled = false;
      this.sortedInAppNotifications = this.sortNotifications(
        await this.notificationsService.getInAppNotifications(
          this.limit,
          this.count - this.limit
        )
      );
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
