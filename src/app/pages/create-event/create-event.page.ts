import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { LocationService } from 'src/app/services/location/location.service';
import { CreateEventGQL, Event, Hub } from 'src/graphql/graphql';
import moment from 'moment';
import { Router } from '@angular/router';

export const eventGroupValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('startDateTime');
  const end = control.get('endDateTime');
  return new Date(end.value) <= new Date(start.value) ? {
    invalidEndDate: true,
    message: `Enter an end date that's after the start date.` 
  } : null;
};

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit, OnDestroy {

  loading = false;
  myForm: UntypedFormGroup;
  image: any;
  photo: Photo;
  startDateTimeModalOpen: boolean = false;
  endDateTimeModalOpen: boolean = false;
  mapModalIsOpen: boolean = false;
  mapSearchSelection: { latitude: number, longitude: number, label: string };
  subscriptions: Subscription[] = [];
  startMin = moment().format();

  seed: any;
  seedType: 'hub' | 'event';

  get endMin() {
    return moment(this.startDateTime.value).add(15, 'minutes').format();
  }

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
    private actionSheetController: ActionSheetController,
    private cameraService: CameraService,
    private logger: NGXLogger,
    private readonly createEvent: CreateEventGQL,
    public readonly navCtrl: NavController,
    public routerOutlet: IonRouterOutlet,
    public locationService: LocationService,
    private readonly alertService: AlertService,
    private readonly router: Router,
  ) {
    this.seed = this.router.getCurrentNavigation()?.extras?.state?.seed;
    this.seedType = this.router.getCurrentNavigation()?.extras?.state?.seedType;
   }

  async ngOnInit() {
    const start = new Date();
    start.setMinutes(0);
    start.setHours(start.getHours() + 1);
    const end = new Date();
    end.setMinutes(0);
    end.setHours(end.getHours() + 3);

    this.myForm = new FormGroup({
      eventName: new FormControl(this.seedType === 'event' ? this?.seed?.name : '', [
        Validators.required
      ]),
      eventDescription: new FormControl(this?.seed?.description || ''),
      startDateTime: new FormControl(moment(start).format()),
      endDateTime: new FormControl(moment(end).format()),
      location: new FormControl(),
    }, { validators: eventGroupValidator });
    
    if (this.seed?.latitude && this.seed?.longitude && this.seed?.locationLabel) {
      this.myForm.patchValue({
        location: {
          latitude: this.seed.latitude,
          longitude: this.seed.longitude,
          label: this.seed.locationLabel,
        } as { latitude: number, longitude: number, label: string }
      });
    }

    if (this.seed?.image) {
      this.image = await this.cameraService.getLocalObjectUrl(this.seed?.image);
    }
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
      startDateTime: new Date(this.startDateTime.value).toISOString(),
      endDateTime: new Date(this.endDateTime.value).toISOString(),
      latitude: this.location.value?.latitude,
      longitude: this.location?.value?.longitude,
      locationLabel: this.location?.value?.label,
      imageFile: this.photo ? await this.cameraService.getImageBlob(this.photo) : await this.cameraService.getBlobFromObjectUrl(this.image),
      hubId: this.seedType === 'hub' ? this.seed?.id : this.seed?.hub?.id || undefined,
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
    this.photo = await this.cameraService.takePicture();
    this.image = this.photo.webPath;
  }

  async selectPicture() {
    this.photo = await this.cameraService.selectPicture();
    this.image = this.photo.webPath;
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

  goToHubPage(id: number) {
    this.navCtrl.navigateForward('hub/' + id);
  }

}
