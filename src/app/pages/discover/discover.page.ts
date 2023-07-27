import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocationService } from 'src/app/services/location/location.service';
import { DeleteFileByIdGQL, DiscoverGQL, EventDocument, File, HubDocument, ReportFileAsInappropriateGQL, User } from 'src/graphql/graphql';
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

  constructor(
    private readonly logger: NGXLogger,
    public readonly navCtrl: NavController,
    public readonly routerOutlet: IonRouterOutlet,
    public readonly locationService: LocationService,
    private readonly modalCtl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private readonly authService: AuthService,
    private readonly reportFileAsInappropriateGqlService: ReportFileAsInappropriateGQL,
    private readonly deleteFileByIdGqlService: DeleteFileByIdGQL,
    private readonly discoverGraphQLService: DiscoverGQL,
  ) {}

  async ngOnInit() {
    const discoverQueryRef = this.discoverGraphQLService.watch();
    this.subscriptions.push(
      discoverQueryRef.valueChanges.subscribe(x => {
        this.fileUploads = [
          ...x?.data?.usersHubs?.map(userHub => userHub?.hub?.fileUploads).flat(),
          ...x?.data?.usersEvents?.map(userEvent => userEvent?.event?.fileUploads).flat(),
        ];
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async openPreview(startingFileIndex) {
    const files = this.fileUploads?.map(x => x?.file);
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
  
  goToPersonPage(id: number, user: any) {
    this.logger.log(user);
    this.navCtrl.navigateForward('person/' + id, {
      state: {
        user
      }
    });
  }

  isOwner(user: User): boolean {
    // if (this.seedType === 'event') {
    //   return this.userEvent?.event?.createdBy?.id === user.id;
    // } else if (this.seedType === 'hub') {
    //   return this.userHub?.isOwner;
    // }
    return false;
  }

  async presentActionSheet(file: File) {
    const user = await this.authService.user();
    const buttons: ActionSheetButton<any>[] = [];
    if (file?.createdBy?.id === user?.id || this.isOwner(user)) {
        buttons.push(
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              if (confirm('Are you sure you want to delete this?')) {
                this.loading = true;
                this.deleteFileByIdGqlService.mutate({ fileId: file.id }, {
                  refetchQueries: [
                    { 
                      query: this.seedType == 'event' ? EventDocument : HubDocument,
                      variables: { id: this.seedId }
                    }
                  ],
                  awaitRefetchQueries: true,
                }).toPromise().then(() => {
                  this.loading = false;
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
              this.reportFileAsInappropriateGqlService.mutate({ fileId: file.id}, {
                refetchQueries: []
              }).toPromise().then(() => {
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
