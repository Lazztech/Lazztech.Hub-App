import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/location/location.service';
import { DiscoverGQL } from 'src/graphql/graphql';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loading = false;
  subscriptions: Subscription[] = [];
  seedId: any;
  seed: any;
  seedType: 'hub' | 'event';
  fileUploads = [];
  organizedFileUploads: any;

  constructor(
    private readonly logger: NGXLogger,
    public readonly navCtrl: NavController,
    public readonly routerOutlet: IonRouterOutlet,
    public readonly locationService: LocationService,
    private readonly modalCtl: ModalController,
    private readonly discoverGraphQLService: DiscoverGQL,
  ) {}

  async ngOnInit() {
    const discoverQueryRef = this.discoverGraphQLService.watch();
    this.loading = true;
    this.subscriptions.push(
      discoverQueryRef.valueChanges.subscribe(x => {
        const sorted = [
          ...x?.data?.usersHubs?.map(userHub => userHub?.hub?.fileUploads).flat(),
          ...x?.data?.usersEvents?.map(userEvent => userEvent?.event?.fileUploads).flat(),
        ].sort(
          (a, b) => new Date(b?.file?.createdOn).valueOf() - new Date(a?.file?.createdOn).valueOf()
        );
        this.fileUploads = sorted;
        let organized = {};
        for (let fileUpload of sorted) {
          if (fileUpload?.file?.createdOn) {
            const createdOnDate = new Date(fileUpload?.file?.createdOn);
            organized[`${createdOnDate.toLocaleString('default', { month: 'long' })} ${createdOnDate.getFullYear()}`] = organized[`${createdOnDate.toLocaleString('default', { month: 'long' })} ${createdOnDate.getFullYear()}`]?.length 
              ? [...organized[`${createdOnDate.toLocaleString('default', { month: 'long' })} ${createdOnDate.getFullYear()}`], fileUpload]
              : [fileUpload];
          }
        }

        this.organizedFileUploads = organized;
        this.loading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async openPreview(startingFileIndex) {
    const modal = await this.modalCtl.create({
      component: ImageModalPage,
      componentProps: {
        startingFileIndex,
        fileJoins: this.fileUploads,
      },
      cssClass: 'transparent-modal fullscreen'
    })
    modal.present();
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
