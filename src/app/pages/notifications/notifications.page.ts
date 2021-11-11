import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { NotificationsService } from "src/app/services/notifications/notifications.service";
import {
  InAppNotification,
  GetInAppNotificationsQuery,
  Exact,
  GetInAppNotificationsCountQuery,
} from "src/generated/graphql";
import { NGXLogger } from "ngx-logger";
import { combineLatest, Observable, Subscription } from "rxjs";
import {
  concatMap,
  map,
  mergeMapTo,
  mergeMap,
  concatMapTo,
  flatMap,
} from "rxjs/operators";
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
  getInAppNotficationsQueryRefcount: QueryRef<
    GetInAppNotificationsCountQuery,
    Exact<{
      [key: string]: never;
    }>
  >;
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
    // let test = this.notificationsService.getInAppNotficationsCount().pipe(flatMap(result => this.notificationsService.getInAppNotificationsFetch(this.limit, result.data.getInAppNotificationsCount-10)))
    // test.((result) => {
    //   this.loading = result.loading;
    //   this.sortedInAppNotifications = this.sortNotifications(
    //     result?.data?.getInAppNotifications
    //   );
    // })

    this.subscriptions.push(
      this.notificationsService
        .getInAppNotficationsCount()
        .pipe(
          map((result) =>
            this.notificationsService.watchGetInAppNotifications(
              this.limit,
              result?.data?.getInAppNotificationsCount - 10
            )
          )
        )
        .subscribe((x) => {
          this.getInAppNotficationsQueryRef = x;
          this.subscriptions.push(
            this.getInAppNotficationsQueryRef.valueChanges.subscribe(
              (result) => {
                this.logger.log("loading: ", result.loading);
                this.loading = result.loading;
                this.sortedInAppNotifications = this.sortNotifications(
                  result?.data?.getInAppNotifications
                );
              }
            )
          );
        })
    );
    this.notificationsService
      .getInAppNotficationsCount()
      .toPromise()
      .then((x) => (this.count = x?.data?.getInAppNotificationsCount));

    // let test3 =

    // this.subscriptions.push( test2.subscribe(x => {
    //   this.getInAppNotficationsQueryRef = x
    // }))
    // .subscribe((x) => (this.count = x.data.getInAppNotificationsCount))

    // this.subscriptions.push(
    //   this.getInAppNotficationsQueryRefcount.valueChanges.subscribe(
    //     (result) => {
    //       this.logger.log(
    //         "notfications count",
    //         result?.data?.getInAppNotificationsCount
    //       );
    //       this.count = result?.data?.getInAppNotificationsCount;
    //     }
    //   )
    // );

    // this.getInAppNotficationsQueryRef =
    //   this.notificationsService.watchGetInAppNotifications(
    //     /**
    //      * This needs to refactored to use a maximum for notfications.
    //      * otherwise the results will always be the oldest
    //      */
    //     this.limit,
    //     this.count - 10,
    //     null
    //   );

    // this.subscriptions.push(
    //   this.getInAppNotficationsQueryRef.valueChanges.subscribe((result) => {
    //     this.logger.log("loading: ", result.loading);
    //     this.loading = result.loading;
    //     this.sortedInAppNotifications = this.sortNotifications(
    //       result?.data?.getInAppNotifications
    //     );
    //   })
    // );
  }

  loadData(event) {
    this.loadMore().then((x) => {
      const data = x?.data?.getInAppNotifications;

      this.sortedInAppNotifications = this.sortNotifications(
        this.sortedInAppNotifications.concat(data)
      );
      event.target.complete();
    });

    if (this.sortedInAppNotifications.length === this.count) {
      event.target.disabled = true;
    }
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
    return this.getInAppNotficationsQueryRef.fetchMore({
      variables: {
        offset: this.sortedInAppNotifications.length,
        limit: this.limit,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          /**
           * This needs to refactored to use a maximum for notfications.
           * otherwise the results will always be the oldest
           */
          // this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
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
          await this.getInAppNotficationsQueryRef.refetch({
            /**
             * This needs to refactored to use a maximum for notfications.
             * otherwise the results will always be the oldest
             */
            limit: this.limit,
            offset: this.count - this.limit,
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
