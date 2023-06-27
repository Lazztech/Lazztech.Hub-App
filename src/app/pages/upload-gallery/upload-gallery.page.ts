import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GalleryPhotos, Photo } from '@capacitor/camera';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/location/location.service';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'app-upload-gallery',
  templateUrl: './upload-gallery.page.html',
  styleUrls: ['./upload-gallery.page.scss'],
})
export class UploadGalleryPage implements OnInit, OnDestroy {

  loading = false;
  myForm: UntypedFormGroup;
  image: any[] = [];
  photos: Photo[] = [];
  gallery: GalleryPhotos;
  subscriptions: Subscription[] = [];

  seed: any;
  seedType: 'hub' | 'event';

  constructor(
    private readonly logger: NGXLogger,
    private readonly router: Router,
    public readonly navCtrl: NavController,
    public readonly routerOutlet: IonRouterOutlet,
    public readonly locationService: LocationService,
    private readonly modalCtl: ModalController,
  ) {
    this.seed = this.router.getCurrentNavigation()?.extras?.state?.seed;
    this.seedType = this.router.getCurrentNavigation()?.extras?.state?.seedType;
   }

  async openPreview(file) {
    const files = this.seed?.fileUploads?.map(x => x?.file) || this.seed?.event?.fileUploads?.map(x => x?.file);
    const modal = await this.modalCtl.create({
      component: ImageModalPage,
      componentProps: {
        files,
      },
      cssClass: 'transparent-modal fullscreen'
    })
    modal.present();
  }

  async ngOnInit() {
    this.myForm = new FormGroup({});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  goToUploadPage() {
    this.navCtrl.navigateForward('upload', {
      state: {
        seed: this.seed,
        seedType: this.seedType,
      }
    });
  }

  goToPersonPage(id: number, user: any) {
    this.logger.log(user);
    this.navCtrl.navigateForward('person/' + id, {
      state: {
        user
      }
    });
  }

}
