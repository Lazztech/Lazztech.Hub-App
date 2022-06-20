import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HubService } from 'src/app/services/hub/hub.service';
import { HubQuery, Scalars, JoinUserHub, InvitesByHubQuery, HubGQL, InvitesByHubGQL } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { NavController, ActionSheetController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera/camera.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApolloQueryResult } from '@apollo/client/core';

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
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.subscriptions.push(
      this.hubGqlService.fetch({ id: this.id }).subscribe(x => {
        this.userHub = x;
        this.loading = x.loading;
        this.myForm = this.fb.group({
          hubName: [x?.data?.hub?.hub?.name, [
            Validators.required,
            Validators.maxLength(25)
          ]],
          hubDescription: [x?.data?.hub?.hub?.description, [
            Validators.maxLength(25)
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

  async save() {
    this.loading = true;
    const formValue = this.myForm.value;
    await this.hubService.editHub(this.id, formValue.hubName, formValue.hubDescription);
    this.loading = false;
  }

  async activeToggle(userHub: JoinUserHub) {
    this.loading = true;
    if (userHub.hub.active === false) {
      await this.hubService.activateHub(userHub.hub.id);
    } else {
      await this.hubService.deactivateHub(userHub.hub.id);
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
    this.cameraService.takePicture().then(newImage => {
      this.loading = true;
      this.hubService.changeHubImage(this.id, newImage).then(() => {
        this.loading = false;
      });
    });
  }

  async selectPicture() {
    this.cameraService.selectPicture().then(newImage => {
      this.loading = true;
      this.hubService.changeHubImage(this.id, newImage).then(() => {
        this.loading = false;
      });
    });
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

  async deleteInvite(hubId: any, inviteId: any) {
    this.hubService.deleteInvite(hubId, inviteId);
  }

  async deleteHub() {
    this.logger.log('Delete clicked');
    const result = confirm('Deleting a hub cannot be undone! Are you sure?');
    if (result) {
      this.loading = true;
      await this.hubService.deleteHub(this.id);
      this.loading = false;
      this.navCtrl.back();
    }
  }

}
