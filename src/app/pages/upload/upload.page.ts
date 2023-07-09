import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GalleryPhotos } from '@capacitor/camera';
import { IonRouterOutlet, NavController } from '@ionic/angular';
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
  gallery: GalleryPhotos;
  subscriptions: Subscription[] = [];

  seed: any;
  seedType: 'hub' | 'event';

  constructor(
    private readonly cameraService: CameraService,
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
    const files = await Promise.all([
      ...this.gallery.photos, 
    ].map(async (photo, index) => new File([await this.cameraService.getImageBlob(photo)], `${index}`, {
      // response doesn't have content type so we're setting an arbitrary image content type
      // so it can be uploaded successfully
      type: "image/jpeg",
    })));
    if (this.seedType === 'hub') {
      await this.uploadHubFiles.mutate({
        files,
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
        files,
        eventId: this.seed?.eventId,
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

  async selectPictures() {
    this.gallery = await this.cameraService.multiSelectPictures();
  }

  goToHubPage(id: number) {
    this.navCtrl.navigateForward('hub/' + id);
  }

}