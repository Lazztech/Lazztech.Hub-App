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
    private logger: NGXLogger
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

  /**
   * helper trackBy function that returns the users isPresent state
   * this helps avoid un-neccesary re-renders unless the isPresent state changes
   * with polling & the lastOnline field included this is needed to avoid flickering in the UI
   * @param index 
   * @param user 
   * @returns 
   */
  userTrackByIsPresent(index: any, user: JoinUserHub) {
    return user.isPresent;
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
        this.sortedUsers = [...data?.hub?.usersConnection]?.sort((a, b) => Number(a.user.lastOnline) - Number(b.user.lastOnline)).reverse();
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
    console.log(userHub.hub.name);
    // tslint:disable-next-line:max-line-length
    window.open(`uber://?client_id=<CLIENT_ID>&action=setPickup&pickup[latitude]=${this.userCoords.latitude}&pickup[longitude]=${this.userCoords.longitude}&pickup[nickname]=Your%20Location&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=${this.hubCoords.latitude}&dropoff[longitude]=${this.hubCoords.longitude}&dropoff[nickname]=${userHub.hub.name}%20Hub&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383`);
  }

  async navigate() {
    // tslint:disable-next-line:max-line-length
    const appleMaps = `http://maps.apple.com/?saddr=${this.userCoords.latitude},${this.userCoords.longitude}&daddr=${this.hubCoords.latitude},${this.hubCoords.longitude}&dirflg=d`;
    // tslint:disable-next-line:max-line-length
    const googleMaps = `https://www.google.com/maps/dir/?api=1&origin=${this.userCoords.latitude},${this.userCoords.longitude}&destination=${this.hubCoords.latitude},${this.hubCoords.longitude}`;
    const actionSheet = await this.actionSheetController.create({
      header: 'Navigate',
      buttons: [
      {
        text: 'Open in Apple Maps',
        handler: () => {
          this.logger.log('Open in Apple Maps clicked');
          window.open(appleMaps);
        }
      },
      {
        text: 'Open in Google Maps',
        handler: () => {
          this.logger.log('Open in Google Maps clicked');
          window.open(googleMaps);
        }
      },
      {
        text: 'Copy coordinates',
        handler: () => {
          this.logger.log('Copy coordinates clicked');
          Clipboard.write({
            string: `${this.hubCoords.latitude},${this.hubCoords.longitude}`
          });
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.logger.log('Cancel clicked');
        }
      }
    ]
    });
    await actionSheet.present();
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
            if (confirm('Report as Inappropriate, against the EULA? This may result in the removal of data & the offending content creator.')) {
              this.navCtrl.back();
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
