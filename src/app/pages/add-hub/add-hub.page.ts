import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ActionSheetController, IonRouterOutlet, Platform } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { GeofenceService } from 'src/app/services/geofence/geofence.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { Hub, UsersPeopleQuery } from 'src/graphql/graphql';

@Component({
  selector: 'app-add-hub',
  templateUrl: './add-hub.page.html',
  styleUrls: ['./add-hub.page.scss'],
})
export class AddHubPage implements OnInit, OnDestroy {

  loading = true;
  invites: Array<{name?: string, email: string}> = [];
  allInvitesSucces = true;
  paid = false;
  myForm: FormGroup;
  hub: Hub = {
    active: true,
    usersConnection: []
  } as Hub;
  persons: Observable<UsersPeopleQuery['usersPeople']>;
  subscriptions: Subscription[] = [];
  image: any;
  mapModalIsOpen: boolean = false;
  mapSearchSelection: { latitude: number, longitude: number, label: string };

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
    private hubService: HubService,
    private geofenceService: GeofenceService,
    public locationService: LocationService,
    private alertService: AlertService,
    private fb: FormBuilder,
    public navCtrl: NavController,
    private cameraService: CameraService,
    private logger: NGXLogger,
    private actionSheetController: ActionSheetController,
    public routerOutlet: IonRouterOutlet,
    private platform: Platform,
    private changeRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      hubName: ['', [
        Validators.required
      ]],
      hubDescription: [],
      location: [],
    });

    this.persons = this.hubService.watchUsersPeople().valueChanges.pipe(map(x => x.data && x.data.usersPeople));

    this.subscriptions.push(
      this.hubService.watchUsersPeople().valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;
      }),
    );
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async takePicture() {
    const image = await this.cameraService.takePicture();
    this.image = image;
  }

  async selectPicture() {
    const image = await this.cameraService.selectPicture();
    this.image = image;
  }

  checkboxChanged(person) {
    const invitee = { name: person.firstName, email: person.email };
    if (this.invites.filter(x => x.email === invitee.email).length){
      const i = this.invites.findIndex(x => x.email === invitee.email);
      this.invites.splice(i, 1);
    } else {
      this.invites.push(invitee);
    }
  }

  async sendInvites(hubId: string): Promise<string> {
    let invited = '';
    await Promise.all(
      this.invites.map(async invite => {
       const result = await this.hubService.inviteUserToHub(hubId, invite.email);
       if (result) {
           invited = invited.concat(`${result?.invitee?.firstName}, `);
        } else {
          this.allInvitesSucces = false;
        }
      })
      );
    return invited;
  }

  async saveHub() {
    this.loading = true;    
    const result = await this.hubService.createHub(
      this.hubName.value,
      this.hubDescription.value,
      this.image,
      this.location?.value?.latitude || this.locationService.location.latitude,
      this.location?.value?.longitude || this.locationService.location.longitude,
      this.location?.value?.label,
    );
    if (result) {
      await this.geofenceService.addGeofence({
        identifier: JSON.stringify({
          id: result.hub.id,
          name: result.hub.name
        }),
        latitude: result.hub.latitude,
        longitude: result.hub.longitude,
        notifyOnEntry: true,
        notifyOnExit: true
      });
      await this.navCtrl.navigateForward(`/hub/${result.hub.id}`);
    } else {
      this.loading = false;
      this.alertService.presentRedToast('Failed to create Hub.');
    }
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
