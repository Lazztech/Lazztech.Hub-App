import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { ActionSheetController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { CameraService } from 'src/app/services/camera/camera.service';
import { LocationService } from 'src/app/services/location/location.service';
import { DeleteEventGQL, Event, EventGQL, EventQuery, Scalars, UpdateEventGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-admin-event',
  templateUrl: './admin-event.page.html',
  styleUrls: ['./admin-event.page.scss'],
})
export class AdminEventPage implements OnInit, OnDestroy {

  loading = false;
  myForm: FormGroup;
  image: any;
  startDateTimeModalOpen: boolean = false;
  endDateTimeModalOpen: boolean = false;
  mapModalIsOpen: boolean = false;
  yourLocation: { latitude: number, longitude: number };
  subscriptions: Subscription[] = [];
  id: Scalars['ID'];
  eventQueryResult: ApolloQueryResult<EventQuery>;
  mapSearchSelection: { latitude: number, longitude: number, label: string };

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
    private readonly fb: FormBuilder,
    private readonly actionSheetController: ActionSheetController,
    private readonly cameraService: CameraService,
    private readonly logger: NGXLogger,
    private readonly route: ActivatedRoute,
    private readonly eventService: EventGQL,
    private readonly deleteEventService: DeleteEventGQL,
    private readonly updateEventService: UpdateEventGQL,
    public routerOutlet: IonRouterOutlet,
    private changeRef: ChangeDetectorRef,
    private platform: Platform,
    private locationService: LocationService,
    public readonly navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.subscriptions.push(
      this.eventService.fetch({
        id: this.id,
      }).subscribe(result => {
        this.eventQueryResult = result;
        this.image = result?.data?.event?.event?.image
        this.myForm = this.fb.group({
          eventName: [result?.data?.event?.event?.name, [
            Validators.required
          ]],
          eventDescription: [result?.data?.event?.event?.description],
          startDateTime: [result?.data?.event?.event?.startDateTime],
          endDateTime: [result?.data?.event?.event?.endDateTime],
          location: [{
            latitude: result?.data?.event?.event?.latitude,
            longitude: result?.data?.event?.event?.longitude,
            locationLabel: result?.data?.event?.event?.locationLabel,
          }],
        });
      }),
      this.locationService.coords$.subscribe(async x => {
        await this.platform.ready();
        this.yourLocation = { latitude: x.latitude, longitude: x.longitude };
        this.changeRef.detectChanges();
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async save() {
    const inputValues = {
      eventId: this.id,
      name: this.eventName.value,
      description: this.eventDescription?.value,
      startDateTime: this.startDateTime?.value,
      endDateTime: this.endDateTime?.value,
      latitude: this.location?.value?.latitude,
      longitude: this.location?.value?.longitude,
      locationLabel: this.location?.value?.label || this.location?.value?.locationLabel
    };
    if (this.image?.includes('base64')) {
      (inputValues as any).image = this.image;
    }
    await this.updateEventService.mutate(inputValues).toPromise();
    this.navCtrl.back();
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

  toggleMapModal() {
    this.mapModalIsOpen = !this.mapModalIsOpen;
  }

  didDismissMapModal() {
    this.mapModalIsOpen = false;
  }

  async deleteEvent() {
    if (confirm('Delete this event?')) {
      await this.deleteEventService.mutate({
        id: this.id
      }, {
        update: (cache, { data: { deleteEvent } }) => {
          const normalizedId = cache.identify({id: this.id, __typename: 'Event', } as Event);
          cache.evict({id: normalizedId});
          cache.gc();
         }
      }).toPromise();
      this.navCtrl.navigateRoot('/tabs/events');
    }
  }

  onSearchSelected(event: any) {
    this.mapSearchSelection = event;
  }

  selectLocation() {
    this.myForm.patchValue({
      location: this.mapSearchSelection
    });
    this.mapModalIsOpen = false;
  }

}
