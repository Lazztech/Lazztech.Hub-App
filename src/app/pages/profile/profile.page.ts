import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, MenuController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Scalars, UsersHubsQuery, MeQuery, JoinUserHub, UserEventsGQL, UserEventsQuery, JoinUserEvent } from 'src/generated/graphql';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Browser } from '@capacitor/browser';
import { ApolloQueryResult } from '@apollo/client/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  loading = true;
  user: Observable<MeQuery['me']>;
  userHubs: Observable<UsersHubsQuery['usersHubs']>;
  userEventsQueryResult: ApolloQueryResult<UserEventsQuery>;
  filteredUsersEvents: UserEventsQuery['usersEvents'];
  subscriptions: Subscription[] = [];

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private alertService: AlertService,
    private themeService: ThemeService,
    private navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public cameraService: CameraService,
    public profileService: ProfileService,
    private hubService: HubService,
    private logger: NGXLogger,
    private readonly userEvents: UserEventsGQL,
  ) {
    this.menu.enable(true);
  }

  async ngOnInit() {
    this.user = this.authService.watchUser().valueChanges.pipe(
      map(x => x.data && x.data.me)
    );

    this.userHubs = this.hubService.watchUserHubs().valueChanges.pipe(
      map(x => x.data && x.data.usersHubs)
    ).pipe(
      map(y => y.filter(z => z.isOwner))
    );

    this.subscriptions.push(
      this.hubService.watchUserHubs().valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;
      }),
      this.userEvents.watch(null,{
        pollInterval: 2000,
      }).valueChanges.subscribe(x => {
        this.userEventsQueryResult = x;
        if (this.userEventsQueryResult?.data?.usersEvents) {
          this.filteredUsersEvents = [...this.userEventsQueryResult?.data?.usersEvents]?.sort(
            (a, b) => new Date(b?.event?.startDateTime).valueOf() - new Date(a?.event?.startDateTime).valueOf()
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  userTrackByHub(index: any, joinUserHub: JoinUserHub) {
    return joinUserHub.hubId;
  }

  trackByEvent(index: any, joinUserEvent: JoinUserEvent) {
    return joinUserEvent.eventId;
  }

  async userActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile Picture',
      buttons: [{
        text: 'Take Picture',
        handler: () => {
          this.logger.log('Take Picture clicked');
          this.cameraService.takePicture().then(image => {
            this.loading = true;
            this.profileService.changeUserImage(image).then(() => {
              this.loading = false;
            });
          });
        }
      },
      {
        text: 'Select Picture',
        handler: async () => {
          this.logger.log('Take Picture clicked');
          await this.cameraService.selectPicture().then(image => {
            this.loading = true;
            this.profileService.changeUserImage(image).then(() => {
              this.loading = false;
            });
          });
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.logger.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile',
      buttons: [{
        text: 'Settings & More',
        handler: () => {
          this.navCtrl.navigateForward('settings');
        }
      }, {
        text: 'Log Out',
        handler: () => this.logout(),
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.logger.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async logout() {
    if (confirm('Are you sure you want to log out?')) {
      await this.authService.logout();
      this.alertService.presentToast('Logged Out');
      this.navCtrl.navigateRoot('/landing');
    }
  }
  async toggleTheme() {
    await this.themeService.toggle();
  }

  adminHub(id: Scalars['ID']) {
    this.navCtrl.navigateForward('admin-hub/' + id);
  }

  adminEvent(id: Scalars['ID']) {
    this.navCtrl.navigateForward('admin-event/' + id);
  }

}
