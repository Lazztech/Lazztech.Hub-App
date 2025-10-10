import { Component, Input } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ErrorService } from 'src/app/services/error.service';
import { MeDocument, UpdateUserGQL } from 'src/graphql/graphql';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  @Input()
  user: any;

  @Input()
  showLastOnline = true;

  @Input()
  editChip = false;
  
  loading: boolean = true;

  constructor(
    public actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    public cameraService: CameraService,
    private readonly updateUserService: UpdateUserGQL,
    private readonly errorService: ErrorService,
  ) {
    
  }

  async userActionSheet() {
      const actionSheet = await this.actionSheetController.create({
        header: 'Profile Picture',
        buttons: [{
          text: 'Take Picture',
          handler: () => {
            try {
              this.cameraService.takePicture().then(image => {
                this.loading = true;
                this.cameraService.getImageBlob(image).then((blob) => {
                  this.updateUserService.mutate({
                    imageFile: blob,
                  }, {
                    context: { useMultipart: true },
                    refetchQueries: [
                      { query: MeDocument }
                    ],
                    awaitRefetchQueries: true,
                  }).toPromise().then(() => {
                    this.loading = false;
                  }).catch(err => this.errorService.handleError(err, this.loading));
                });
              });
            } catch (error) {
              this.errorService.handleError(error, this.loading);
            }
          }
        },
        {
          text: 'Select Picture',
          handler: async () => {
            try {
              await this.cameraService.selectPicture().then(image => {
                this.loading = true;
                this.cameraService.getImageBlob(image).then((blob) => {
                  this.updateUserService.mutate({
                    imageFile: blob,
                  }, {
                    context: { useMultipart: true },
                    refetchQueries: [
                      { query: MeDocument }
                    ],
                    awaitRefetchQueries: true,
                  }).toPromise().then(() => {
                    this.loading = false;
                  }).catch(err => this.errorService.handleError(err, this.loading));
                });
              });
            } catch (error) {
              this.errorService.handleError(error, this.loading);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }]
      });
      await actionSheet.present();
    }
  

}
