import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GalleryPhotos, Photo } from '@capacitor/camera';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ErrorService } from 'src/app/services/error.service';
import { LocationService } from 'src/app/services/location/location.service';
import { UploadEventFilesGQL, UploadHubFilesGQL } from 'src/graphql/graphql';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit, OnDestroy {

  loading = false;
  myForm: UntypedFormGroup;
  image: any[] = [];
  photo: Photo;
  gallery: GalleryPhotos;
  subscriptions: Subscription[] = [];

  seed: any;
  seedType: 'hub' | 'event';

  constructor(
    private readonly actionSheetController: ActionSheetController,
    private readonly cameraService: CameraService,
    private readonly logger: NGXLogger,
    private readonly uploadEventFiles: UploadEventFilesGQL,
    private readonly uploadHubFiles: UploadHubFilesGQL,
    private readonly router: Router,
    private readonly errorService: ErrorService,
    public readonly navCtrl: NavController,
    public readonly routerOutlet: IonRouterOutlet,
    public readonly locationService: LocationService,
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
    this.loading = true;
    if (this.seedType === 'hub') {
      await this.uploadHubFiles.mutate({
        files: this.photo ? await this.cameraService.getImageBlob(this.photo) : await this.cameraService.getBlobFromObjectUrl(this.image[0]),
        hubId: this.seed?.id,
      }, {
        context: { useMultipart: true },
      })
        .toPromise()
        .then(async result => {
          this.loading = false;
          await this.navCtrl.navigateForward(`/hub/${result?.data?.uploadHubFiles?.hubId}`);
        })
        .catch(err => this.errorService.handleError(err, this.loading));
    } else if (this.seedType === 'event') {
      await this.uploadEventFiles.mutate({
        files: this.photo ? await this.cameraService.getImageBlob(this.photo) : await this.cameraService.getBlobFromObjectUrl(this.image[0]),
        eventId: this.seed?.id,
      }, {
        context: { useMultipart: true },
      })
        .toPromise()
        .then(async result => {
          this.loading = false;
          await this.navCtrl.navigateForward(`/event/${result?.data?.uploadEventFiles?.eventId}`);
        })
        .catch(err => this.errorService.handleError(err, this.loading));
    } else {
      this.loading = false;
    }
  }

  async takePicture() {
    this.photo = await this.cameraService.takePicture();
    this.image = [this.photo.webPath];
  }

  async selectPictures() {
    this.gallery = await this.cameraService.multiSelectPictures();
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
          text: 'Select Pictures',
          // icon: 'arrow-dropright-circle',
          handler: () => {
            this.logger.log('Select Picture clicked');
            this.selectPictures();
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
