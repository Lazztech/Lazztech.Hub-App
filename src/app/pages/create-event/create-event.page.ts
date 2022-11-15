import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { LocationService } from 'src/app/services/location/location.service';
import { CreateEventGQL } from 'src/graphql/graphql';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit, OnDestroy {

  loading = false;
  myForm: FormGroup;
  image: any;
  startDateTimeModalOpen: boolean = false;
  endDateTimeModalOpen: boolean = false;
  mapModalIsOpen: boolean = false;
  mapSearchSelection: { latitude: number, longitude: number, label: string };
  subscriptions: Subscription[] = [];

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

  get location() {
    return this.myForm.get('location');
  }

  constructor(
    private fb: FormBuilder,
    private actionSheetController: ActionSheetController,
    private cameraService: CameraService,
    private logger: NGXLogger,
    private readonly createEvent: CreateEventGQL,
    public readonly navCtrl: NavController,
    public routerOutlet: IonRouterOutlet,
    public locationService: LocationService,
    private readonly alertService: AlertService,
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      eventName: ['', [
        Validators.required
      ]],
      eventDescription: [''],
      startDateTime: [],
      endDateTime: [],
      location: [],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async handleError(err) {
    await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    this.loading = false;
  }

  async save() {
    this.loading = true;
    await this.createEvent.mutate({
      name: this.eventName.value,
      description: this.eventDescription.value,
      startDateTime: (this.startDateTime.value) ? this.startDateTime.value : new Date(),
      endDateTime: (this.endDateTime.value) ? this.endDateTime.value : undefined,
      latitude: this.location.value?.latitude,
      longitude: this.location?.value?.longitude,
      locationLabel: this.location?.value?.label,
      imageFile: this.image?.includes('blob') ? await this.cameraService.getImageBlob({ webPath: this.image } as Photo) : undefined,
    }, {
      context: { useMultipart: true },
    })
      .toPromise()
      .then(async result => {
        this.loading = false;
        await this.navCtrl.navigateForward(`/event/${result?.data?.createEvent?.eventId}`);
      })
      .catch(err => this.handleError(err));
  }

  async takePicture() {
    const image = await this.cameraService.takePicture();
    this.image = image.webPath;
  }

  async selectPicture() {
    const image = await this.cameraService.selectPicture();
    this.image = image.webPath;
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

  toggleMapModal() {
    this.mapModalIsOpen = !this.mapModalIsOpen;
  }

  didDismissStartDateTimeModal() {
    this.startDateTimeModalOpen = false;
  }

  didDismissEndDateTimeModal() {
    this.endDateTimeModalOpen = false;
  }

  didDismissMapModal() {
    this.mapModalIsOpen = false;
  }

  onSearchSelected(event: any) {
    this.mapSearchSelection = event;
  }

  onMapLoading(loading: boolean) {
    this.loading = loading;
  }

  selectLocation() {
    this.myForm.patchValue({
      location: this.mapSearchSelection
    });
    this.mapModalIsOpen = false;
  }

}
