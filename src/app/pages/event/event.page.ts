import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Clipboard } from '@capacitor/clipboard';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { InviteComponent } from 'src/app/components/invite/invite.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { NavigationService } from 'src/app/services/navigation.service';
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
  @ViewChild(InviteComponent)
  private inviteComponent: InviteComponent;

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
    private readonly authService: AuthService,
    public readonly routerOutlet: IonRouterOutlet,
    public readonly navigationService: NavigationService,
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
    this.navigationService.requestUber(this.userCoords, userEvent.event, userEvent.event.name);
  }

  async presentActionSheet() {
    const buttons = [];

    if (this.userEventQueryResult?.data?.event?.event?.createdBy?.id == (await this.authService.user())?.id) {
      buttons.push({
        text: 'Manage Event',
        handler: () => {
          this.navCtrl.navigateForward('admin-event/' + this.id);
        }
      });
    } else {
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
    }

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

  async sendInvites() {
    await this.inviteComponent.sendInvites();
    this.toggleInviteModal();
  }

  async navigate(userEvent: JoinUserEvent) {
    this.navigationService.navigate(this.userCoords, userEvent.event)
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

  didDismissInviteModal() {
    this.inviteModalIsOpen = false;
  }

}
