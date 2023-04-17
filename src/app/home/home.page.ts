import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Config, MenuController, NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { Hub, InvitesByUserGQL, InvitesByUserQuery, JoinUserHub, User, UsersHubsGQL, UsersHubsQuery } from 'src/graphql/graphql';
import { environment } from '../../environments/environment';
import { LeafletMapComponent } from '../components/leaflet-map/leaflet-map.component';
import { AlertService } from '../services/alert/alert.service';
import { AuthService } from '../services/auth/auth.service';
import { DebuggerService } from '../services/debugger/debugger.service';
import { LocationService } from '../services/location/location.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  devModeEasterEggEnabled: boolean = false;
  devModeEasterEggTimeoutId: any;
  devModeEasterEggCount = 0;

  loading = true;
  @ViewChild(LeafletMapComponent)
  map: LeafletMapComponent;
  completedInitialAccountSetup: boolean;
  invites: InvitesByUserQuery['invitesByUser'];
  filter = '';
  filteredUserHubs: UsersHubsQuery['usersHubs'];
  userHubs: UsersHubsQuery['usersHubs'];
  hubs: Hub[] = [];
  user: User;
  queryRefs: QueryRef<any>[] = [];
  subscriptions: Subscription[] = [];
  public mode: string;

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    public navCtrl: NavController,
    public locationService: LocationService,
    private logger: NGXLogger,
    private readonly invitesByUserGQLService: InvitesByUserGQL,
    private readonly userHubsGQLService: UsersHubsGQL,
    private readonly debugService: DebuggerService,
    private readonly alertService: AlertService,
    private readonly config: Config,
  ) {
    this.menu.enable(true);
    this.mode = this.config.get("mode");
  }

  async devModeEasterEgg() {
    clearTimeout(this.devModeEasterEggTimeoutId)
    this.devModeEasterEggCount += 1;
    console.log('devModeEasterEggCount: ', this.devModeEasterEggCount);
    if (this.devModeEasterEggCount >= 5 && !this.devModeEasterEggEnabled) {
      this.debugService.start();
      this.alertService.create({
        message: `✨✨ 🪄 You're a wizard now! 🪄 ✨✨`,
        duration: 2000,
        position: 'top',
        translucent: true,
      });
      this.devModeEasterEggCount = 0;
    }
    this.devModeEasterEggTimeoutId = setTimeout(() => {
      this.devModeEasterEggCount = 0;
      console.log('reset devModeEasterEggCount: ', this.devModeEasterEggCount);
    }, 1000);
  }

  async ngOnInit() {
    this.user = await this.authService.user();

    const userHubsQueryRef = this.userHubsGQLService.watch(null, { pollInterval: 3000 });
    const invitesByUserRef = this.invitesByUserGQLService.watch(null, { pollInterval: 3000 });
    this.queryRefs.push(userHubsQueryRef, invitesByUserRef);

    this.subscriptions.push(
      userHubsQueryRef.valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;

        if (environment.demoMode) {
          this.userHubs = environment.demoData.usersHubs.usersHubs;
        } else {
          this.userHubs = [...x?.data?.usersHubs]?.filter(x => x.hub)?.sort((a, b) => {
            if (this?.locationService.location) {
              console.log('sorting');
              
              return this.locationService.getDistanceFromHub(a?.hub as Hub, this?.locationService.location) - this.locationService.getDistanceFromHub(b?.hub as Hub, this?.locationService.location);
            } else {
              return 1;
            }
          });

          this.hubs = this.userHubs?.map(x => x.hub as Hub);
        }
      }, err => this.handleError(err)),
      invitesByUserRef.valueChanges.subscribe(x => {
        this.invites = x?.data?.invitesByUser;
        this.loading = x.loading;
      }, err => this.handleError(err))
    );
  }

  async ionViewDidEnter() {
    this.completedInitialAccountSetup = await this.authService.completedInitialAccountSetup();
    this.queryRefs.forEach(queryRef => queryRef.startPolling(3000));
    this.map?.invalidateSize();
  }

  async ionViewDidLeave() {
    this.queryRefs.forEach(queryRef => queryRef.stopPolling());
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
  }

  async handleError(err) {
    await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    this.loading = false;
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

  goToSettingsPage() {
    this.navCtrl.navigateForward('settings');
  }

  filterHubs(ev: any) {
    this.filter = ev.target.value;

    if (this.filter && this.filter.trim() !== '') {
      this.filteredUserHubs = this.userHubs.filter(y => {
        const name = y.hub.name.trim().toLowerCase();
        return name.includes(this.filter.trim().toLowerCase());
      });
    }
  }

  goToMap() {
    this.navCtrl.navigateForward('map');
  }

  async goToQrPage() {
    const user = await this.authService.user();
    this.navCtrl.navigateForward('qr', {
      state: {
        data: user?.shareableId,
        title: user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}` : undefined,
        subtitle: 'Scan to invite me',
        image: user?.image,
      }
    });
  }

}
