import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HubService } from 'src/app/services/hub/hub.service';
import { HubQuery, Scalars, JoinUserHub, InvitesByHubQuery, HubGQL, InvitesByHubGQL, UpdateHubGQL, RemoveUserFromHubGQL, HubDocument, ResetShareableHubIdGQL } from 'src/graphql/graphql';
import { NGXLogger } from 'ngx-logger';
import { NavController, ActionSheetController, IonRouterOutlet, Platform } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera/camera.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApolloQueryResult } from '@apollo/client/core';
import { LocationService } from 'src/app/services/location/location.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-admin-hub',
  templateUrl: './admin-hub.page.html',
  styleUrls: ['./admin-hub.page.scss'],
})
export class AdminHubPage implements OnInit, OnDestroy {

  loading = true;
  invites: ApolloQueryResult<InvitesByHubQuery>;
  userHub: ApolloQueryResult<HubQuery>;
  subscriptions: Subscription[] = [];
  id: Scalars['ID'];
  mapModalIsOpen: boolean = false;
  mapSearchSelection: { latitude: number, longitude: number, label: string };
  image: any;
  active: boolean;

  myForm: FormGroup;

  get hubName() {
    return this.myForm.get('hubName');
  }

  get hubDescription() {
    return this.myForm.get('hubDescription');
  }

  get location() {
    return this.myForm.get('location');
  }

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    private fb: FormBuilder,
    private logger: NGXLogger,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private cameraService: CameraService,
    private readonly hubGqlService: HubGQL,
    private readonly inviteByHubService: InvitesByHubGQL,
    private readonly updateHubService: UpdateHubGQL,
    public routerOutlet: IonRouterOutlet,
    public locationService: LocationService,
    private platform: Platform,
    private changeRef: ChangeDetectorRef,
    private readonly removeUserFromHubGqlService: RemoveUserFromHubGQL,
    private readonly resetShareableHubID: ResetShareableHubIdGQL,
    private readonly alertService: AlertService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.subscriptions.push(
      this.hubGqlService.fetch({ id: this.id }).subscribe(x => {
        this.userHub = x;
        this.image = x?.data?.hub?.hub?.image;
        this.active = x?.data?.hub?.hub?.active;
        this.loading = x.loading;
        this.myForm = this.fb.group({
          hubName: [x?.data?.hub?.hub?.name, [
            Validators.required,
            Validators.maxLength(50)
          ]],
          hubDescription: [x?.data?.hub?.hub?.description, [
            Validators.maxLength(1000)
          ]],
          location: [{
            latitude: x?.data?.hub?.hub?.latitude,
            longitude: x?.data?.hub?.hub?.longitude,
            locationLabel: x?.data?.hub?.hub?.locationLabel,
          }],
        });
      }),
      this.inviteByHubService.fetch({ hubId: this.id }).subscribe(y => {
        this.invites = y;
        this.loading = y.loading;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  trackByUser(index: any, joinUserHub: JoinUserHub) {
    return joinUserHub.userId;
  }

  async invalidateShareableLinks() {
    if (confirm('Are you sure you want to invalidate any previously shared links to this?')) {
      this.loading = true;
      try {
        await this.resetShareableHubID.mutate({ 
          id: this.userHub?.data?.hub?.hubId,
        }).toPromise();
        this.alertService.presentToast('Shareable ID Has Been Reset');
      } catch (error) {
        this.alertService.presentRedToast('Whoops, something went wrong...');
      }
      this.loading = false;
    }
  }

  async removeUserFromHub(otherUsersId: any, slidingItem: any) {
    if (confirm('Are you sure you want to remove this user?')) {
      await this.removeUserFromHubGqlService.mutate({
        hubId: this.userHub?.data?.hub?.hubId,
        otherUsersId
      }, {
        refetchQueries: [
          { query: HubDocument, variables: { id: this.id } }
        ]
      }).toPromise();
    }
    await slidingItem.close();
  }

  async save() {
    this.loading = true;
    await this.updateHubService.mutate({
      hubId: this.id,
      name: this.hubName?.value,
      description: this.hubDescription?.value,
      image: this.image?.includes('base64') ? this.image : undefined,
      latitude: this.location?.value?.latitude,
      longitude: this.location?.value?.longitude,
      locationLabel: this.location?.value?.label || this.location?.value?.locationLabel,
    }).toPromise();
    this.loading = false;
    this.navCtrl.back();
  }

  async toggleActivity() {
    this.loading = true;
    if (!this.userHub?.data?.hub?.hub?.active) {
      await this.hubService.activateHub(this.id);
    } else {
      await this.hubService.deactivateHub(this.id);
    }
    this.loading = false;
  }

  async invite() {
    this.navCtrl.navigateForward('invite/' + this.id);
    this.logger.log('Invite clicked');
  }

  goToPersonPage(id: number, user: any) {
    this.logger.log(user);
    this.navCtrl.navigateForward('person/' + id, {
      state: {
        user
      }
    });
  }

  async takePicture() {
    const image = await this.cameraService.takePicture();
    this.image = image;
  }

  async selectPicture() {
    const image = await this.cameraService.selectPicture();
    this.image = image;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      buttons: [
        {
          text: 'Take Picture',
          // icon: 'arrow-dropright-circle',
          handler: () => {
            this.logger.log('Take Picture clicked');
            this.takePicture();
          }
        },
        {
          text: 'Select Picture',
          // icon: 'arrow-dropright-circle',
          handler: () => {
            this.logger.log('Select Picture clicked');
            this.selectPicture();
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

  async goToMap(userHub: JoinUserHub) {
    console.log(userHub);
    this.navCtrl.navigateForward('map', {
      state: {
        hubCoords: {
          latitude: userHub.hub.latitude,
          longitude: userHub.hub.longitude
        },
        hub: userHub.hub,
      }
    });
  }

  async deleteInvite(inviteId: any) {
    this.hubService.deleteInvite(this.id, inviteId);
  }

  async deleteHub() {
    this.logger.log('Delete clicked');
    const result = confirm('Deleting a hub cannot be undone! Are you sure?');
    if (result) {
      this.loading = true;
      await this.hubService.deleteHub(this.id);
      this.loading = false;
      await this.navCtrl.navigateRoot('/tabs');
    }
  }

  toggleMapModal() {
    this.mapModalIsOpen = !this.mapModalIsOpen;
  }

  didDismissMapModal() {
    this.mapModalIsOpen = false;
  }

  onSearchSelected(event: any) {
    this.mapSearchSelection = event;
  }

  selectLocation() {
    this.myForm.patchValue({
      location: this.mapSearchSelection
    });
    this.mapModalIsOpen = false;
  }

}
