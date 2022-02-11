import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { Hub, InvitesByUserQuery, User, UsersHubsQuery } from 'src/generated/graphql';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth/auth.service';
import { ForegroundGeofenceService } from '../services/foreground-geofence.service';
import { HubService } from '../services/hub/hub.service';
import { LocationService } from '../services/location/location.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  loading = true;
  invites: InvitesByUserQuery['invitesByUser'];
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
    private foregroundGeofenceService: ForegroundGeofenceService
  ) {
    this.menu.enable(true);
  }

  async ngOnInit() {
    this.user = await this.authService.user();
    this.foregroundGeofenceService.init();

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
          this.userHubs = [...x?.data?.usersHubs]?.sort((a, b) => {
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
      this.hubService.watchInvitesByUser().valueChanges.subscribe(x => {
        this.loading = x.loading;
      }),
      this.hubService.watchInvitesByUser(null, 10000).valueChanges.subscribe(x => {
        this.invites = x?.data?.invitesByUser;
      })
    );
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
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
    // this.userHubs = this.hubService.watchUserHubs('cache-only').valueChanges.pipe(map(x => x.data && x.data.usersHubs));
    // const val = ev.target.value;
    // if (val && val.trim() !== '') {
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
