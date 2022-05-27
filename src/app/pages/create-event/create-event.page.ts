import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { CameraService } from 'src/app/services/camera/camera.service';
import { CreateEventGQL } from 'src/generated/graphql';

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
    await this.createEvent.mutate({
      name: this.eventName.value,
      description: this.eventDescription.value,
      image: this.image,
    }).toPromise();
    this.loading = false;
  }

  async takePicture() {
    const image = await this.cameraService.takePicture();
    this.image = image;
  }

  async selectPicture() {
    const image = await this.cameraService.selectPicture();
    this.image = image;
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
