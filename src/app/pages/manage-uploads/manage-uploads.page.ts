import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/location/location.service';
import { DeleteFileByIdGQL, MyFileUploadsDocument, MyFileUploadsGQL, MyFileUploadsQuery } from 'src/graphql/graphql';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'app-manage-uploads',
  templateUrl: './manage-uploads.page.html',
  styleUrls: ['./manage-uploads.page.scss'],
})
export class ManageUploadsPage implements OnInit, OnDestroy {

  loading = false;
  data: MyFileUploadsQuery['myFileUploads'];
  joinHubFile: MyFileUploadsQuery['myFileUploads'];
  joinEventFile: MyFileUploadsQuery['myFileUploads'];
  subscriptions: Subscription[] = [];

  constructor(
    private readonly logger: NGXLogger,
    public readonly navCtrl: NavController,
    public readonly routerOutlet: IonRouterOutlet,
    public readonly locationService: LocationService,
    private readonly modalCtl: ModalController,
    private readonly myFileUploadsGqlService: MyFileUploadsGQL,
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly deleteFileByFileIdGqlService: DeleteFileByIdGQL,
  ) { }

  async openPreview(startingFileIndex) {
    const modal = await this.modalCtl.create({
      component: ImageModalPage,
      componentProps: {
        startingFileIndex,
        files: this.data?.map(join => join.file),
      },
      cssClass: 'transparent-modal fullscreen'
    })
    modal.present();
  }

  async ngOnInit() {
    const myUploadsQueryRef = this.myFileUploadsGqlService.watch(null, {
      fetchPolicy: 'cache-first'
    }).valueChanges;

    this.subscriptions.push(
      myUploadsQueryRef.subscribe(result => {
        this.data = result.data.myFileUploads;
        this.joinEventFile = this.data?.filter((val) => val.__typename == 'JoinEventFile');
        this.joinHubFile = this.data?.filter((val) => val.__typename == 'JoinHubFile');
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async presentActionSheet(fileId: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            if (confirm('Are you sure you want to delete this file?')) {
              await this.deleteFileById(fileId);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async deleteFileById(fileId: any) {
    this.loading = true;
    await this.deleteFileByFileIdGqlService.mutate({ fileId }, {
      refetchQueries: [
        { query: MyFileUploadsDocument }
      ]
    }).toPromise();
    this.loading = false;
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
