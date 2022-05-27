import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { CameraService } from 'src/app/services/camera/camera.service';
import { CreateEventGQL } from 'src/generated/graphql';
import { MapPage } from '../map/map.page';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  loading = false;
  myForm: FormGroup;
  image: any;

  get eventName() {
    return this.myForm.get('eventName');
  }

  get eventDescription() {
    return this.myForm.get('eventDescription');
  }

  constructor(
    private fb: FormBuilder,
    private actionSheetController: ActionSheetController,
    private cameraService: CameraService,
    private logger: NGXLogger,
    private readonly createEvent: CreateEventGQL,
    public readonly navCtrl: NavController,
    private readonly modalController: ModalController,
    public routerOutlet: IonRouterOutlet,
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      eventName: ['', [
        Validators.required
      ]],
      eventDescription: [''],
    });
  }

  async save() {
    this.loading = true;
    const result = await this.createEvent.mutate({
      name: this.eventName.value,
      description: this.eventDescription.value,
      image: this.image,
    }).toPromise();
    this.loading = false;
    await this.navCtrl.navigateForward(`/event/${result.data?.createEvent?.eventId}`);
  }

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
      // sheet modal
      // breakpoints: [0.1, 0.5, 1],
      // initialBreakpoint: 0.5,
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

}
