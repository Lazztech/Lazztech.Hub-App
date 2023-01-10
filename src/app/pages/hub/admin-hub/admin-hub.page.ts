import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Photo } from '@capacitor/camera';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { InviteComponent } from 'src/app/components/invite/invite.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { HubDocument, HubGQL, HubQuery, InvitesByHubGQL, InvitesByHubQuery, JoinUserHub, RemoveUserFromHubGQL, ResetShareableHubIdGQL, Scalars, UpdateHubGQL, User } from 'src/graphql/graphql';

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
  photo: Photo;
  active: boolean;
  inviteModalIsOpen: boolean = false;
  @ViewChild(InviteComponent)
  private inviteComponent: InviteComponent;
  notYetInvitedPeople: Array<User> = [];
  queryRefs: QueryRef<any>[] = [];

  myForm: UntypedFormGroup;

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
    private fb: UntypedFormBuilder,
    private logger: NGXLogger,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private cameraService: CameraService,
    private readonly hubGqlService: HubGQL,
    private readonly inviteByHubService: InvitesByHubGQL,
    private readonly updateHubService: UpdateHubGQL,
    public routerOutlet: IonRouterOutlet,
    public locationService: LocationService,
    private readonly removeUserFromHubGqlService: RemoveUserFromHubGQL,
    private readonly resetShareableHubID: ResetShareableHubIdGQL,
    private readonly alertService: AlertService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    const usersPeopleQueryRef = this.hubService.watchUsersPeople(null, 3000);
    const hubQueryRef = this.hubGqlService.watch({ id: this.id });
    const invitesByHubQueryRef = this.inviteByHubService.watch({ hubId: this.id });
    this.queryRefs.push(usersPeopleQueryRef, hubQueryRef, invitesByHubQueryRef);

    this.subscriptions.push(
      hubQueryRef.valueChanges.subscribe(x => {
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
      invitesByHubQueryRef.valueChanges.subscribe(y => {
        this.invites = y;
        this.loading = y.loading;
      }),
      usersPeopleQueryRef.valueChanges.subscribe(result => {
        this.notYetInvitedPeople = result?.data?.usersPeople?.filter(person => {
          return !this.invites?.data?.invitesByHub
            ?.find(x => x.inviteesId === person?.id);
        }) as any;
      }, err => this.handleError(err)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async ionViewDidLeave() {
    this.queryRefs.forEach(queryRef => queryRef.stopPolling());
  }

  async handleError(err) {
    await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    this.loading = false;
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
      latitude: this.location?.value?.latitude,
      longitude: this.location?.value?.longitude,
      locationLabel: this.location?.value?.label || this.location?.value?.locationLabel,
      imageFile: this.photo ? await this.cameraService.getImageBlob(this.photo) : undefined,
    }, {
      context: { useMultipart: true },
      refetchQueries: [
        { query: HubDocument, variables: { id: this.id } }
      ],
      awaitRefetchQueries: true,
    }).toPromise().catch(err => this.handleError(err));
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

  goToPersonPage(id: number, user: any) {
    this.logger.log(user);
    this.navCtrl.navigateForward('person/' + id, {
      state: {
        user
      }
    });
  }

  async takePicture() {
    this.photo = await this.cameraService.takePicture();
    this.image = this.photo.webPath;
  }

  async selectPicture() {
    this.photo = await this.cameraService.selectPicture();
    this.image = this.photo.webPath;
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

  onMapLoading(loading: boolean) {
    this.loading = loading;
  }

  async deleteInvite(inviteId: any) {
    try {
      this.loading = true;
      await this.hubService.deleteInvite(this.id, inviteId);
      this.loading = false;
    } catch (error) {
      this.handleError(error);
    }
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
