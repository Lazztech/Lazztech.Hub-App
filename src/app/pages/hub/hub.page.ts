import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { CameraService } from 'src/app/services/camera/camera.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { Scalars, HubQuery, JoinUserHub, User } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { map, take } from 'rxjs/operators';
import { Clipboard } from '@capacitor/clipboard';
import { NavigationService } from 'src/app/services/navigation.service';
import { InviteComponent } from 'src/app/components/invite/invite.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit, OnDestroy {

  loading = true;
  userHub: HubQuery['hub'];
  sortedUsers: HubQuery['hub']['hub']['usersConnection'];
  id: Scalars['ID'];
  qrContent: string;
  subscriptions: Subscription[] = [];
  hubCoords: {latitude: number, longitude: number};
  inviteModalIsOpen: boolean = false;
  @ViewChild(InviteComponent)
  private inviteComponent: InviteComponent;
  notYetInvitedPeople: Array<User> = [];

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
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.qrContent = JSON.stringify({ id: this.id });

    this.subscriptions.push(
      this.hubService.watchHub(this.id, null, 2000).valueChanges.subscribe(result => {
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
      }),
      this.hubService.watchUsersPeople().valueChanges.subscribe(result => {
        this.notYetInvitedPeople = result?.data?.usersPeople?.filter(person => {
          return !this.sortedUsers
            ?.find(x => x.user?.id === person?.id);
        }) as any;
      })
    );
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
      } else if (!this.userHub.isOwner) {
        buttons.push({
          text: 'Leave Hub',
          role: 'destructive',
          handler: () => {
            this.loading = true;
            this.hubService.leaveHub(this.id).then(() => {
              this.loading = false;
            });
            this.navCtrl.back();
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

  async share() {
    await Share.share({
      title: `You invited to my community Hub, "${this.userHub.hub?.name}"`,
      text: `You invited to my community Hub, "${this.userHub.hub?.name}"`,
      url: 'https://hub.lazz.tech/',
      dialogTitle: 'Share with buddies',
    });
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
