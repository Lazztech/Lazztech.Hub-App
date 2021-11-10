import { Component, OnInit, OnDestroy } from "@angular/core";
import { NotificationsService } from "src/app/services/notifications/notifications.service";
import {
  InAppNotification,
  GetInAppNotificationsQuery,
} from "src/generated/graphql";
import { NGXLogger } from "ngx-logger";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
})
export class NotificationsPage implements OnInit, OnDestroy {
  loading = true;

  inAppNotifications: Observable<
    GetInAppNotificationsQuery["getInAppNotifications"]
  >;
  subscriptions: Subscription[] = [];
  limit: number = 10;
  offset: number = 0;

  constructor(
    private notificationsService: NotificationsService,
    private logger: NGXLogger,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.inAppNotifications = this.notificationsService
      .watchGetInAppNotifications(null, 5000)
      .valueChanges.pipe(map((x) => x.data && x.data.getInAppNotifications))
      .pipe(map((x) => this.sortNotifications(x)));

    this.subscriptions.push(
      this.notificationsService
        .watchGetInAppNotifications()
        .valueChanges.subscribe((x) => {
          this.logger.log("loading: ", x.loading);
          this.loading = x.loading;
        })
    );
  }

  loadData(event) {
    this.inAppNotifications;
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

  async doRefresh(event) {
    try {
      this.loading = true;
      this.inAppNotifications = this.notificationsService
        .watchGetInAppNotifications("network-only")
        .valueChanges.pipe(map((x) => x.data && x.data.getInAppNotifications))
        .pipe(map((x) => this.sortNotifications(x)));
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
