import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/location/location.service';
import { MyFileUploadsGQL, MyFileUploadsQuery } from 'src/graphql/graphql';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'app-manage-uploads',
  templateUrl: './manage-uploads.page.html',
  styleUrls: ['./manage-uploads.page.scss'],
})
export class ManageUploadsPage implements OnInit, OnDestroy {

  loading = false;
  data: MyFileUploadsQuery['me']['fileUploads'];
  subscriptions: Subscription[] = [];

  constructor(
    private readonly logger: NGXLogger,
    public readonly navCtrl: NavController,
    public readonly routerOutlet: IonRouterOutlet,
    public readonly locationService: LocationService,
    private readonly modalCtl: ModalController,
    private readonly myFileUploadsGqlService: MyFileUploadsGQL,
  ) { }

  async openPreview(startingFileIndex) {
    const modal = await this.modalCtl.create({
      component: ImageModalPage,
      componentProps: {
        startingFileIndex,
        files: this.data,
      },
      cssClass: 'transparent-modal fullscreen'
    })
    modal.present();
  }

  async ngOnInit() {
    const myUploadsQueryRef = this.myFileUploadsGqlService.fetch(null, {
      fetchPolicy: 'cache-first'
    });

    this.subscriptions.push(
      myUploadsQueryRef.subscribe(result => {
        this.data = result.data.me.fileUploads;
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
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
