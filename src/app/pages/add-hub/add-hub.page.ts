import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ActionSheetController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { GeofenceService } from 'src/app/services/geofence/geofence.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { Hub, UsersPeopleQuery } from 'src/generated/graphql';

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

  locationSubscription: Subscription;
  coords: { latitude: number, longitude: number };

  get hubName() {
    return this.myForm.get('hubName');
  }

  get hubDescription() {
    return this.myForm.get('hubDescription');
  }

  constructor(
    private hubService: HubService,
    private geofenceService: GeofenceService,
    private locationService: LocationService,
    private alertService: AlertService,
    private fb: FormBuilder,
    public navCtrl: NavController,
    private cameraService: CameraService,
    private logger: NGXLogger,
    private actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      hubName: ['', [
        Validators.required
      ]],
      hubDescription: ['', [
        Validators.required
      ]]
    });

    this.persons = this.hubService.watchUsersPeople().valueChanges.pipe(map(x => x.data && x.data.usersPeople));

    this.subscriptions.push(
      this.hubService.watchUsersPeople().valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;
      })
    );
  }

  async ionViewDidEnter() {
    // FIXME this should be refactored into the HubService to avoid repeating code
    this.coords = await this.locationService.coords$.pipe(take(1)).toPromise();
    this.loading = false;
  }

  async takePicture() {
    const image = await this.cameraService.takePicture();
    this.hub.image = image;
  }

  async selectPicture() {
    const image = await this.cameraService.selectPicture();
    this.hub.image = image;
  }

  isFree() {
    if (this.paid) {
      this.paid = false;
    }
  }

  isPaid() {
    if (!this.paid) {
      this.paid = true;
    }
  }
  checkboxChanged(person) {
    const invitee = { name: person.firstName, email: person.email };
    if (this.invites.filter(i => i.email === invitee.email).length){
      const i = this.invites.findIndex(i => i.email === invitee.email);
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
    const formValue = this.myForm.value;
    this.logger.log(this.coords);
    const result = await this.hubService.createHub(
      this.hubName.value,
      this.hubDescription.value,
      this.hub.image,
      this.coords.latitude,
      this.coords.longitude
    );
    if (result) {
      await this.geofenceService.addGeofence({
        identifier: JSON.stringify({
          id: result.hub.id,
          name: result.hub.name
        }),
        latitude: this.coords.latitude,
        longitude: this.coords.longitude,
        notifyOnEntry: true,
        notifyOnExit: true
      });
      const invited = await this.sendInvites(result.hubId);
      this.loading = false;
      if (invited !== '') {
        await this.alertService.presentToast(`${invited.slice(0, invited.length - 2)} have been sucessfully invited`, 6000);
        await this.alertService.presentToast('Created Hub!', 3000);
      }
      if (this.allInvitesSucces){
        await this.navCtrl.navigateRoot('/tabs');
        await this.navCtrl.navigateForward(`/admin-hub/${result.hub.id}`);
        }
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

  async ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

}
