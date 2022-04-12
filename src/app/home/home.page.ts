import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { Hub, InvitesByUserQuery, JoinUserHub, User, UsersHubsQuery } from 'src/generated/graphql';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth/auth.service';
import { ForegroundGeofenceService } from '../services/foreground-geofence.service';
import { HubService } from '../services/hub/hub.service';
import { LocationService } from '../services/location/location.service';
import { NotificationsService } from '../services/notifications/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  loading = true;
  invites: InvitesByUserQuery['invitesByUser'];
  userHubsFilter = '';
  userHubs: UsersHubsQuery['usersHubs'];
  hubs: Hub[] = [];
  user: User;
  subscriptions: Subscription[] = [];
  yourLocation: { latitude: number, longitude: number };

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    public navCtrl: NavController,
    private hubService: HubService,
    private locationService: LocationService,
    private changeRef: ChangeDetectorRef,
    private logger: NGXLogger,
    private foregroundGeofenceService: ForegroundGeofenceService,
    private notificationsService: NotificationsService,
  ) {
    this.menu.enable(true);
  }

  async ngOnInit() {
    this.user = await this.authService.user();
    this.foregroundGeofenceService.init();
    await this.notificationsService.setupPushNotifications();

    this.subscriptions.push(
      this.locationService.coords$.subscribe(async x => {
        this.yourLocation = { latitude: x.latitude, longitude: x.longitude };
        this.changeRef.detectChanges();
      }),
      this.hubService.watchUserHubs(null, 2000).valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;

        if (environment.demoMode) {
          this.userHubs = environment.demoData.usersHubs.usersHubs;
        } else {
          this.userHubs = [...x?.data?.usersHubs]?.filter(x => x.hub)?.sort((a, b) => {
            if (this?.yourLocation) {
              console.log('sorting');
              
              return this.locationService.getDistanceFromHub(a?.hub as Hub, this?.yourLocation) - this.locationService.getDistanceFromHub(b?.hub as Hub, this?.yourLocation);
            } else {
              return 1;
            }
          });

          this.hubs = this.userHubs?.map(x => x.hub as Hub);
        }
      }),
      this.hubService.watchInvitesByUser(null, 10000).valueChanges.subscribe(x => {
        this.invites = x?.data?.invitesByUser;
        this.loading = x.loading;
      })
    );
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
  }

  userTrackByHub(index: any, joinUserHub: JoinUserHub) {
    return joinUserHub.hubId;
  }

  goToHubPage(id: number) {
    this.navCtrl.navigateForward('hub/' + id);
  }

  goToPreviewHubPage(id) {
    this.navCtrl.navigateForward('preview-hub/' + id);
  }

  goToStatusPage() {
    this.navCtrl.navigateForward('status');
  }

  goToAddHubPage() {
    this.navCtrl.navigateForward('add-hub');
  }

  async filterHubs(ev: any) {
    // this.userHubsFilter = ev.target.value;

    // this.userHubs = this.hubService.watchUserHubs('cache-only').valueChanges.pipe(map(x => x.data && x.data.usersHubs));
    // if (this.userHubsFilter && this.userHubsFilter.trim() !== '') {
    //   this.userHubs = this.userHubs.pipe(
    //     map(x => x.filter(y => y.hub.name.toLowerCase().includes(val.toLowerCase())))
    //   );
    // }
  }

  goToMap() {
    this.navCtrl.navigateForward('map', {
      state: {
        hubCoords: this.yourLocation,
        hubs: this.hubs
      }
    });
  }

}
