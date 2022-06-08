import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { CameraService } from 'src/app/services/camera/camera.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { Scalars, HubQuery, JoinUserHub } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { map, take } from 'rxjs/operators';
import { Clipboard } from '@capacitor/clipboard';
import { NavigationService } from 'src/app/services/navigation.service';

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
  userCoords: {latitude: number, longitude: number};

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    public cameraService: CameraService,
    private platform: Platform,
    private changeRef: ChangeDetectorRef,
    private locationService: LocationService,
    private logger: NGXLogger,
    public readonly navigationService: NavigationService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.qrContent = JSON.stringify({ id: this.id });

    this.loadHub();
  }

  async ionViewDidEnter() {
    // FIXME this should be refactored into the HubService to avoid repeating code
    this.subscriptions.push(
      this.locationService.coords$.subscribe(async x => {
        this.userCoords = { latitude: x.latitude, longitude: x.longitude };
        this.changeRef.detectChanges();
      })
    );
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  trackByUser(index: any, joinUserHub: JoinUserHub) {
    return joinUserHub.userId;
  }

  loadHub() {
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
    );
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
   this.navigationService.requestUber(this.userCoords, userHub.hub, userHub.hub?.name);
  }

  async navigate(userHub: JoinUserHub) {
    this.navigationService.navigate(this.userCoords, userHub.hub)
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

}
