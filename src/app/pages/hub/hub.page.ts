import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { InviteComponent } from 'src/app/components/invite/invite.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { HubQuery, JoinUserHub, MuteGQL, Scalars, UnmuteGQL, User } from 'src/graphql/graphql';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit, OnDestroy {

  loading = true;
  userHub: HubQuery['hub'];
  present: HubQuery['hub']['hub']['usersConnection'];
  away: HubQuery['hub']['hub']['usersConnection'];
  sortedUsers: HubQuery['hub']['hub']['usersConnection'];
  id: Scalars['ID'];
  qrContent: string;
  hubCoords: {latitude: number, longitude: number};
  inviteModalIsOpen: boolean = false;
  @ViewChild(InviteComponent)
  private inviteComponent: InviteComponent;
  notYetInvitedPeople: Array<User> = [];

  subscriptions: Subscription[] = [];
  queryRefs: QueryRef<any>[] = [];

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    public cameraService: CameraService,
    private platform: Platform,
    private changeRef: ChangeDetectorRef,
    public locationService: LocationService,
    private logger: NGXLogger,
    public readonly navigationService: NavigationService,
    public readonly routerOutlet: IonRouterOutlet,
    private readonly communcationService: CommunicationService,
    private alertService: AlertService,
    private muteService: MuteGQL,
    private unmuteService: UnmuteGQL,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.qrContent = JSON.stringify({ id: this.id });

    const hubQueryRef = this.hubService.watchHub(this.id, null, 3000);
    const usersPeopleQueryRef = this.hubService.watchUsersPeople(null, 3000);
    this.queryRefs.push(hubQueryRef, usersPeopleQueryRef);

    this.subscriptions.push(
      hubQueryRef.valueChanges.subscribe(result => {
        const data = result.data.hub;
        this.userHub = data;
        this.loading = result.loading;

        this.hubCoords = {
          latitude: data.hub.latitude,
          longitude: data.hub.longitude
        };
        this.sortedUsers = [...data?.hub?.usersConnection]
          .filter(x => !!x?.user)
          .sort((a, b) => Number(a.user.lastOnline) - Number(b.user.lastOnline))
          .reverse();
        this.present = this.sortedUsers?.filter(x => x.isPresent);
        this.away = this.sortedUsers?.filter(x => !x.isPresent);
      }, err => this.handleError(err)),
      usersPeopleQueryRef.valueChanges.subscribe(result => {
        this.notYetInvitedPeople = result?.data?.usersPeople?.filter(person => {
          return !this.sortedUsers
            ?.find(x => x.user?.id === person?.id);
        }) as any;
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

  async ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  trackByUser(index: any, joinUserHub: JoinUserHub) {
    return joinUserHub.userId;
  }

  goToPersonPage(id: number, user: any) {
    this.navCtrl.navigateForward('person/' + id, {
      state: {
        user
      }
    });
  }

  async goToMap() {
    if (this.userHub?.hub) {
      this.navCtrl.navigateForward('map', {
        state: {
          hubCoords: this.hubCoords,
          hub: this.userHub.hub
        }
      });
    }
  }

  async requestRide(userHub: JoinUserHub) {
   this.navigationService.requestUber(this.locationService.location, userHub.hub, userHub.hub?.name);
  }

  async navigate(userHub: JoinUserHub) {
    this.navigationService.navigate(this.locationService.location, userHub.hub)
  }

  openPhone(event: Event, number: string) {
    event.stopPropagation();
    this.communcationService.openPhone(number);
  }

  openSms(event: Event, number: string) {
    event.stopPropagation();
    this.communcationService.openSms(number);
  }

  async presentActionSheet() {
    if (this.userHub) {
      const buttons = [];
      console.log('is hub owner' + this.userHub.isOwner);
      if (this.userHub.isOwner) {
        buttons.push({
          text: 'Manage Hub',
          handler: () => {
            this.navCtrl.navigateForward('admin-hub/' + this.id);
          }
        });
      }
      buttons.push({
        text: this.userHub.muted ? 'Unmute' : 'Mute',
        handler: () => {
          if (this.userHub.muted) {
            this.unmuteService.mutate({ hubId: this.userHub.hubId }).toPromise()
              .then(() => {
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.muteService.mutate({ hubId: this.userHub.hubId }).toPromise()
              .then(() => {
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          }
        }
      });    
      if (!this.userHub.isOwner) {
        buttons.push({
          text: 'Leave Hub',
          role: 'destructive',
          handler: () => {
            if (confirm('Are you sure you want to leave this Hub?')) {
              this.loading = true;
              this.hubService.leaveHub(this.id).then(() => {
                this.loading = false;
              });
              this.navCtrl.back();
            }
          }
        },
        {
          text: 'Report as Inappropriate',
          role: 'destructive',
          handler: () => {
            if (confirm('Report as Inappropriate? This may result in the removal of data & the offending content creator.')) {
              this.loading = true;
              this.hubService.reportAsInappropriate(this.id).then(() => {
                this.loading = false;
                this.navCtrl.back();
              });
            }
          }
        });
      }

      const actionSheet = await this.actionSheetController.create({
        header: 'Hub Options',
        buttons: [
          ...buttons,
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
  }

  async sendInvites() {
    await this.inviteComponent.sendInvites();
    this.toggleInviteModal();
  }

  toggleInviteModal() {
    this.inviteModalIsOpen = !this.inviteModalIsOpen;
  }

  didDismissInviteModal() {
    this.inviteModalIsOpen = false;
  }

}
