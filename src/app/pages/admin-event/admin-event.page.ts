import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { CameraService } from 'src/app/services/camera/camera.service';
import { MapPage } from '../map/map.page';

@Component({
  selector: 'app-admin-event',
  templateUrl: './admin-event.page.html',
  styleUrls: ['./admin-event.page.scss'],
})
export class AdminEventPage implements OnInit {

  loading = false;
  myForm: FormGroup;
  image: any;
  startDateTimeModalOpen: boolean = false;
  endDateTimeModalOpen: boolean = false;

  get eventName() {
    return this.myForm.get('eventName');
  }

  get eventDescription() {
    return this.myForm.get('eventDescription');
  }

  get startDateTime() {
    return this.myForm.get('startDateTime');
  }

  get endDateTime() {
    return this.myForm.get('endDateTime');
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly actionSheetController: ActionSheetController,
    private readonly cameraService: CameraService,
    private readonly logger: NGXLogger,
    private readonly modalController: ModalController,
    public routerOutlet: IonRouterOutlet,
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      eventName: ['', [
        Validators.required
      ]],
      eventDescription: [''],
      startDateTime: [],
      endDateTime: [],
    });
  }

  async save() {}

  async takePicture() {
    const image = await this.cameraService.takePicture();
    this.image = image;
  }

  async selectPicture() {
    const image = await this.cameraService.selectPicture();
    this.image = image;
  }

  async openMapModal() {
    const registerModal = await this.modalController.create({
      component: MapPage,
      swipeToClose: true,
      // card modal
      presentingElement: this.routerOutlet.nativeEl
    });
    return await registerModal.present();
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

  toggleStartDateTimeModal() {
    this.startDateTimeModalOpen = !this.startDateTimeModalOpen;
  }

  toggleEndDateTimeModal() {
    this.endDateTimeModalOpen = !this.endDateTimeModalOpen;
  }

  didDismissStartDateTimeModal() {
    this.startDateTimeModalOpen = false;
  }

  didDismissEndDateTimeModal() {
    this.endDateTimeModalOpen = false;
  }

}
