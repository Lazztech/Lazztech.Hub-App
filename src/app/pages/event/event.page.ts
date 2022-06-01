import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Clipboard } from '@capacitor/clipboard';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { EventGQL, EventQuery, JoinUserEvent, ReportEventAsInappropriateGQL, Scalars, User, UsersPeopleQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {

  loading = false;
  id: Scalars['ID'];
  userEventQueryResult: ApolloQueryResult<EventQuery>;
  presentUserEvents: EventQuery['event']['event']['usersConnection'];
  goingUserEvents: EventQuery['event']['event']['usersConnection'];
  maybeUserEvents: EventQuery['event']['event']['usersConnection'];
  cantgoUserEvents: EventQuery['event']['event']['usersConnection'];
  noreplyUserEvents: EventQuery['event']['event']['usersConnection'];
  persons: ApolloQueryResult<UsersPeopleQuery>;
  notYetInvitedPeople: Array<User> = [];
  subscriptions: Subscription[] = [];
  userCoords: {latitude: number, longitude: number};
  inviteModalIsOpen: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly hubService: HubService,
    private readonly eventService: EventGQL,
    private readonly reportEventAsInappropriateService: ReportEventAsInappropriateGQL,
    private readonly actionSheetController: ActionSheetController,
    private readonly navCtrl: NavController,
    private readonly logger: NGXLogger,
    private readonly locationService: LocationService,
    private readonly changeRef: ChangeDetectorRef,
    public readonly routerOutlet: IonRouterOutlet,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.subscriptions.push(
      this.eventService.watch({
        id: this.id
      }, {
        pollInterval: 2000,
      }).valueChanges.subscribe(x => {
        this.userEventQueryResult = x;
        this.presentUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => x.isPresent);
        this.goingUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => x.rsvp == 'going');
        this.maybeUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => x.rsvp == 'maybe');
        this.cantgoUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => x.rsvp == 'cantgo');
        this.noreplyUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => !x.rsvp);
      }),
      this.locationService.coords$.subscribe(async x => {
        this.userCoords = { latitude: x.latitude, longitude: x.longitude };
        this.changeRef.detectChanges();
      }),
      this.hubService.watchUsersPeople().valueChanges.subscribe(result => {
        this.persons = result;
        this.notYetInvitedPeople = result?.data?.usersPeople?.filter(person => {
          return !this.userEventQueryResult?.data?.event?.event?.usersConnection
            ?.find(x => x.user?.id === person?.id);
        }) as any;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }


  trackByUser(index: any, joinUserEvent: JoinUserEvent) {
    return joinUserEvent.userId;
  }

  async requestRide(userEvent: JoinUserEvent) {
    // tslint:disable-next-line:max-line-length
    window.open(`uber://?client_id=<CLIENT_ID>&action=setPickup&pickup[latitude]=${this.userCoords.latitude}&pickup[longitude]=${this.userCoords.longitude}&pickup[nickname]=Your%20Location&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=${userEvent.event.latitude}&dropoff[longitude]=${userEvent.event.longitude}&dropoff[nickname]=${userEvent.event.name}%20Hub&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383`);
  }

  async presentActionSheet() {

      const buttons = [];
        buttons.push(
        {
          text: 'Report as Inappropriate',
          role: 'destructive',
          handler: () => {
            if (confirm('Report as Inappropriate? This may result in the removal of data & the offending content creator.')) {
              this.loading = true;
              this.reportEventAsInappropriateService.mutate({
                eventId: this.id
              }).toPromise().then(() => {
                this.loading = false;
                this.navCtrl.back();
              });
            }
          }
        });

      const actionSheet = await this.actionSheetController.create({
        header: 'Event Options',
        buttons: [
          ...buttons,
          {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.logger.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
  }

  async navigate(userEvent: JoinUserEvent) {
    // tslint:disable-next-line:max-line-length
    const appleMaps = `http://maps.apple.com/?saddr=${this.userCoords.latitude},${this.userCoords.longitude}&daddr=${userEvent.event.latitude},${userEvent.event.longitude}&dirflg=d`;
    // tslint:disable-next-line:max-line-length
    const googleMaps = `https://www.google.com/maps/dir/?api=1&origin=${this.userCoords.latitude},${this.userCoords.longitude}&destination=${userEvent.event.latitude},${userEvent.event.longitude}`;
    const actionSheet = await this.actionSheetController.create({
      header: 'Navigate',
      buttons: [
      {
        text: 'Open in Apple Maps',
        handler: () => {
          this.logger.log('Open in Apple Maps clicked');
          window.open(appleMaps);
        }
      },
      {
        text: 'Open in Google Maps',
        handler: () => {
          this.logger.log('Open in Google Maps clicked');
          window.open(googleMaps);
        }
      },
      {
        text: 'Copy coordinates',
        handler: () => {
          this.logger.log('Copy coordinates clicked');
          Clipboard.write({
            string: `${userEvent.event.latitude},${userEvent.event.longitude}`
          });
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

  goToPersonPage(id: number, user: any) {
    this.navCtrl.navigateForward('person/' + id, {
      state: {
        user
      }
    });
  }

  toggleInviteModal() {
    this.inviteModalIsOpen = !this.inviteModalIsOpen;
  }

}
