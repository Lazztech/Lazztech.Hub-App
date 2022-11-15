import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { ActionSheetController, MenuController, NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { JoinUserEvent, JoinUserHub, MeQuery, Scalars, UserEventsGQL, UserEventsQuery, UsersHubsGQL, UsersHubsQuery } from 'src/graphql/graphql';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  
  filteredUsersHubs: UsersHubsQuery['usersHubs'];
  filteredUsersEvents: UserEventsQuery['usersEvents'];
  userResult: ApolloQueryResult<MeQuery>;
  userHubsResult: ApolloQueryResult<UsersHubsQuery>;
  userEventsQueryResult: ApolloQueryResult<UserEventsQuery>;

  loading: boolean = true;
  
  subscriptions: Subscription[] = [];
  queryRefs: QueryRef<any>[] = [];

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private alertService: AlertService,
    private themeService: ThemeService,
    private navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public cameraService: CameraService,
    public profileService: ProfileService,
    private logger: NGXLogger,
    private readonly userEvents: UserEventsGQL,
    private readonly userHubsGQLService: UsersHubsGQL,
  ) {
    this.menu.enable(true);
  }

  async ngOnInit() {
    const userQueryRef = this.authService.watchUser();
    const userHubsQueryRef = this.userHubsGQLService.watch(null, { pollInterval: 3000 });
    const userEventsQueryRef = this.userEvents.watch(null, { pollInterval: 3000 });
    this.queryRefs.push(userQueryRef, userHubsQueryRef, userEventsQueryRef);

    this.subscriptions.push(
      userQueryRef.valueChanges.subscribe(result => {
        this.userResult = result;
        this.loading = result.loading;
      }, err => this.handleError(err)),
      userHubsQueryRef.valueChanges.subscribe(result => {
        this.userHubsResult = result;
        if (this.userHubsResult?.data?.usersHubs) {
          this.filteredUsersHubs = this.userHubsResult?.data?.usersHubs.filter(
            userHub => userHub.isOwner
          );
        }
      }, err => this.handleError(err)),
      userEventsQueryRef.valueChanges.subscribe(result => {
        this.userEventsQueryResult = result;
        if (this.userEventsQueryResult?.data?.usersEvents) {
          this.filteredUsersEvents = [...this.userEventsQueryResult?.data?.usersEvents]
            ?.filter(userEvent => userEvent?.event?.createdBy?.id == this.userResult?.data?.me?.id)
            ?.sort(
              (a, b) => new Date(b?.event?.startDateTime).valueOf() - new Date(a?.event?.startDateTime).valueOf()
            );
        }
      }, err => this.handleError(err))
    );
  }

  async handleError(err) {
    await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    this.loading = false;
  }

  async ionViewDidEnter() {
    this.queryRefs.forEach(queryRef => queryRef.startPolling(3000));
  }

  async ionViewDidLeave() {
    this.queryRefs.forEach(queryRef => queryRef.stopPolling());
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
            // this.loading = true;
            this.profileService.changeUserImage(image.base64String).then(() => {
              // this.loading = false;
            });
          });
        }
      },
      {
        text: 'Select Picture',
        handler: async () => {
          this.logger.log('Take Picture clicked');
          await this.cameraService.selectPicture().then(image => {
            // this.loading = true;
            this.profileService.changeUserImage(image.dataUrl).then(() => {
              // this.loading = false;
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
