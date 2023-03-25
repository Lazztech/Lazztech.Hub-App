import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Photo } from '@capacitor/camera';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { LocationService } from 'src/app/services/location/location.service';
import { DeleteEventGQL, Event, EventDocument, EventGQL, EventQuery, JoinUserEvent, RemoveUserFromEventGQL, ResetShareableEventIdGQL, Scalars, UpdateEventGQL } from 'src/graphql/graphql';
import moment from 'moment';

export const eventGroupValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('startDateTime');
  const end = control.get('endDateTime');
  return new Date(end.value) <= new Date(start.value) ? {
    invalidEndDate: true,
    message: `Enter an end date that's after the start date.` 
  } : null;
};

export type AlphabetMapOfJoinUserEvent = {
  [letter: string]: Array<JoinUserEvent>;
};

@Component({
  selector: 'app-admin-event',
  templateUrl: './admin-event.page.html',
  styleUrls: ['./admin-event.page.scss'],
})
export class AdminEventPage implements OnInit, OnDestroy {

  loading = true;
  myForm: UntypedFormGroup;
  image: any;
  photo: Photo;
  startDateTimeModalOpen: boolean = false;
  endDateTimeModalOpen: boolean = false;
  mapModalIsOpen: boolean = false;
  subscriptions: Subscription[] = [];
  id: Scalars['ID'];
  eventQueryResult: ApolloQueryResult<EventQuery>;
  mapSearchSelection: { latitude: number, longitude: number, label: string };
  alphabetizedMembers: AlphabetMapOfJoinUserEvent;

  get eventName() {
    return this.myForm.get('eventName');
  }

  get eventDescription() {
    return this.myForm.get('eventDescription');
  }

  get startDateTime() {
    return this.myForm.get('startDateTime');
  }

  get minimumCapacity() {
    return this.myForm.get('minimumCapacity');
  }

  get maximumCapacity() {
    return this.myForm.get('maximumCapacity');
  }

  get endDateTime() {
    return this.myForm.get('endDateTime');
  }

  get location() {
    return this.myForm.get('location');
  }

  constructor(
    private readonly actionSheetController: ActionSheetController,
    private readonly cameraService: CameraService,
    private readonly logger: NGXLogger,
    private readonly route: ActivatedRoute,
    private readonly eventService: EventGQL,
    private readonly deleteEventService: DeleteEventGQL,
    private readonly updateEventService: UpdateEventGQL,
    private readonly removeUserFromEventGqlService: RemoveUserFromEventGQL,
    public routerOutlet: IonRouterOutlet,
    public locationService: LocationService,
    public readonly navCtrl: NavController,
    private readonly resetShareableEventID: ResetShareableEventIdGQL,
    private readonly alertService: AlertService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.subscriptions.push(
      this.eventService.watch({
        id: this.id,
      }).valueChanges.subscribe(result => {
        this.loading = result.loading;
        this.eventQueryResult = result;
        this.image = result?.data?.event?.event?.image;
        this.myForm =new FormGroup({
          eventName: new FormControl(result?.data?.event?.event?.name, [
            Validators.required
          ]),
          eventDescription: new FormControl(result?.data?.event?.event?.description),
          startDateTime: new FormControl(moment(result?.data?.event?.event?.startDateTime).format()),
          endDateTime: new FormControl(moment(result?.data?.event?.event?.endDateTime).format()),
          minimumCapacity: new FormControl(result?.data?.event?.event?.minimumCapacity),
          maximumCapacity: new FormControl(result?.data?.event?.event?.maximumCapacity),
          location: new FormControl({
            latitude: result?.data?.event?.event?.latitude,
            longitude: result?.data?.event?.event?.longitude,
            locationLabel: result?.data?.event?.event?.locationLabel,
          }),
        }, { validators: eventGroupValidator });

        this.alphabetizedMembers = this.alphabetizePersons(
          result?.data?.event?.event?.usersConnection as Array<JoinUserEvent>
        );
      }, err => this.handleError(err)),
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  alphabetizePersons(persons: Array<JoinUserEvent>): AlphabetMapOfJoinUserEvent {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let alphabetArray = alphabet.split('');
    const alphabetizedPersons = [...persons]?.sort((a, b) => (
      a?.user?.lastName?.toLowerCase().localeCompare(b?.user?.lastName?.toLowerCase())
    ));
    console.log(alphabetizedPersons);
    const alphabetMap = <AlphabetMapOfJoinUserEvent>{};
    alphabetArray.forEach(letter => {
      const startsWithLetter = alphabetizedPersons.filter(join => join?.user?.lastName?.toLowerCase()?.startsWith(letter));
      alphabetMap[letter] = startsWithLetter;
    });
    // non alphabetical character for last name
    alphabetMap['#'] = alphabetizedPersons.filter(
      join => alphabet.indexOf(join?.user?.lastName?.toLowerCase()[0]) == -1
    );
    return alphabetMap;
  }

  goToPersonPage(id: number, user: any) {
    this.logger.log(user);
    this.navCtrl.navigateForward('person/' + id, {
      state: {
        user
      }
    });
  }

  async removeUserFromEvent(otherUsersId: any, slidingItem: any) {
    if (confirm('Are you sure you want to remove this user?')) {
      try {
        await this.removeUserFromEventGqlService.mutate({
          eventId: this.eventQueryResult?.data?.event?.eventId,
          otherUsersId
        }, {
          refetchQueries: [
            { query: EventDocument, variables: { id: this.id } }
          ]
        }).toPromise(); 
      } catch (error) {
        this.handleError(error);
      }
    }
    await slidingItem.close();
  }

  async handleError(err) {
    await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    this.loading = false;
  }

  async invalidateShareableLinks() {
    if (confirm('Are you sure you want to invalidate any previously shared links to this?')) {
      this.loading = true;
      try {
        await this.resetShareableEventID.mutate({ 
          id: this.eventQueryResult?.data?.event?.eventId,
        }).toPromise(); 
        this.alertService.presentToast('Shareable ID Has Been Reset');
      } catch (error) {
        this.alertService.presentRedToast('Whoops, something went wrong...');
      }
      this.loading = false;
    }
  }

  async save() {
    this.loading = true;
    await this.updateEventService.mutate({
        eventId: this.id,
        name: this.eventName.value,
        description: this.eventDescription?.value,
        startDateTime: this.startDateTime?.value,
        endDateTime: this.endDateTime?.value,
        minimumCapacity: this.minimumCapacity?.value ? Number(this.minimumCapacity?.value) : undefined,
        maximumCapacity: this.maximumCapacity?.value ? Number(this.maximumCapacity?.value) : undefined,
        latitude: this.location?.value?.latitude,
        longitude: this.location?.value?.longitude,
        locationLabel: this.location?.value?.label || this.location?.value?.locationLabel,
        imageFile: this.photo ? await this.cameraService.getImageBlob(this.photo) : undefined,
        hubId: this.eventQueryResult?.data?.event?.event?.hub?.id,
    }, {
      context: { useMultipart: true },
      refetchQueries: [
        { query: EventDocument, variables: { id: this.id } }
      ],
      awaitRefetchQueries: true,
    })
      .toPromise()
      .then(() => {
        this.loading = false;
        this.navCtrl.back();
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
