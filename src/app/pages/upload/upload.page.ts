import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ErrorService } from 'src/app/services/error.service';
import { LocationService } from 'src/app/services/location/location.service';
import { CreateEventGQL } from 'src/graphql/graphql';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit, OnDestroy {

  loading = false;
  myForm: UntypedFormGroup;
  image: any;
  photo: Photo;
  subscriptions: Subscription[] = [];

  seed: any;
  seedType: 'hub' | 'event';

  constructor(
    private actionSheetController: ActionSheetController,
    private cameraService: CameraService,
    private logger: NGXLogger,
    private readonly createEvent: CreateEventGQL,
    public readonly navCtrl: NavController,
    public routerOutlet: IonRouterOutlet,
    public locationService: LocationService,
    private readonly router: Router,
    private readonly errorService: ErrorService,
  ) {
    this.seed = this.router.getCurrentNavigation()?.extras?.state?.seed;
    this.seedType = this.router.getCurrentNavigation()?.extras?.state?.seedType;
   }

  async ngOnInit() {
    this.myForm = new FormGroup({});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async save() {
    // this.loading = true;
    // await this.createEvent.mutate({
    //   imageFile: this.photo ? await this.cameraService.getImageBlob(this.photo) : await this.cameraService.getBlobFromObjectUrl(this.image),
    //   hubId: this.seedType === 'hub' ? this.seed?.id : this.seed?.hub?.id || undefined,
    // }, {
    //   context: { useMultipart: true },
    // })
    //   .toPromise()
    //   .then(async result => {
    //     this.loading = false;
    //     await this.navCtrl.navigateForward(`/event/${result?.data?.createEvent?.eventId}`);
    //   })
    //   .catch(err => this.errorService.handleError(err, this.loading));
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

  goToHubPage(id: number) {
    this.navCtrl.navigateForward('hub/' + id);
  }

}
