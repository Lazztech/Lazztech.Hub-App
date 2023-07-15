import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetButton, ActionSheetController, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocationService } from 'src/app/services/location/location.service';
import { DeleteFileByIdGQL, File, ReportFileAsInappropriateGQL } from 'src/graphql/graphql';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'app-upload-gallery',
  templateUrl: './upload-gallery.page.html',
  styleUrls: ['./upload-gallery.page.scss'],
})
export class UploadGalleryPage implements OnInit, OnDestroy {

  loading = false;
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
    private actionSheetCtrl: ActionSheetController,
    private readonly authService: AuthService,
    private readonly reportFileAsInappropriateGqlService: ReportFileAsInappropriateGQL,
    private readonly deleteFileByIdGqlService: DeleteFileByIdGQL,
  ) {
    this.seed = this.router.getCurrentNavigation()?.extras?.state?.seed;
    this.seedType = this.router.getCurrentNavigation()?.extras?.state?.seedType;
   }

  async openPreview(startingFileIndex) {
    const files = this.seed?.fileUploads?.map(x => x?.file) || this.seed?.event?.fileUploads?.map(x => x?.file);
    const modal = await this.modalCtl.create({
      component: ImageModalPage,
      componentProps: {
        startingFileIndex,
        files,
      },
      cssClass: 'transparent-modal fullscreen'
    })
    modal.present();
  }

  async ngOnInit() {
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

  async presentActionSheet(file: File) {
    const user = await this.authService.user();
    const buttons: ActionSheetButton<any>[] = [];

    if (file?.createdBy?.id === user?.id) {
        buttons.push(
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              if (confirm('Are you sure you want to delete this?')) {
                this.loading = true;
                this.deleteFileByIdGqlService.mutate({ fileId: file.id }).toPromise().then(() => {
                  this.loading = false;
                  this.navCtrl.back();
                });
              }
            }
          }
        )
    } else {
      buttons.push(
        {
          text: 'Report as Inappropriate',
          role: 'destructive',
          handler: () => {
            if (confirm('Report as Inappropriate? This may result in the removal of data & the offending content creator.')) {
              this.loading = true;
              this.reportFileAsInappropriateGqlService.mutate({ fileId: file.id}).toPromise().then(() => {
                this.loading = false;
                this.navCtrl.back();
              });
            }
          }
        }
      )
    }

    buttons.push(
      {
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      }
    );

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'File Actions',
      buttons,
    });

    await actionSheet.present();
  }

}
