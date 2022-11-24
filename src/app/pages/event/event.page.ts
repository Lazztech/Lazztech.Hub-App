import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { ActionSheetController, IonRouterOutlet, NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { InviteComponent } from 'src/app/components/invite/invite.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { EventGQL, EventQuery, JoinUserEvent, ReportEventAsInappropriateGQL, Scalars, User, UsersPeopleQuery } from 'src/graphql/graphql';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {

  loading = true;
  id: Scalars['ID'];
  userEventQueryResult: ApolloQueryResult<EventQuery>;
  presentUserEvents: EventQuery['event']['event']['usersConnection'];
  goingUserEvents: EventQuery['event']['event']['usersConnection'];
  maybeUserEvents: EventQuery['event']['event']['usersConnection'];
  cantgoUserEvents: EventQuery['event']['event']['usersConnection'];
  noreplyUserEvents: EventQuery['event']['event']['usersConnection'];
  persons: ApolloQueryResult<UsersPeopleQuery>;
  notYetInvitedPeople: Array<User> = [];
  inviteModalIsOpen: boolean = false;
  @ViewChild(InviteComponent)
  private inviteComponent: InviteComponent;

  queryRefs: QueryRef<any>[] = [];
  subscriptions: Subscription[] = [];


  constructor(
    private readonly route: ActivatedRoute,
    private readonly hubService: HubService,
    private readonly eventService: EventGQL,
    private readonly reportEventAsInappropriateService: ReportEventAsInappropriateGQL,
    private readonly actionSheetController: ActionSheetController,
    private readonly navCtrl: NavController,
    private readonly logger: NGXLogger,
    public readonly locationService: LocationService,
    private readonly authService: AuthService,
    public readonly routerOutlet: IonRouterOutlet,
    public readonly navigationService: NavigationService,
    private readonly communcationService: CommunicationService,
    private readonly alertService: AlertService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    const eventQueryRef = this.eventService.watch({id: this.id }, { pollInterval: 3000 });
    const usersPeopleQueryRef = this.hubService.watchUsersPeople(null, 3000);
    this.queryRefs.push(eventQueryRef, usersPeopleQueryRef);

    this.subscriptions.push(
      eventQueryRef?.valueChanges?.subscribe(x => {
        this.loading = x.loading;
        this.userEventQueryResult = x;
        this.presentUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => x.isPresent);
        this.goingUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => x.rsvp == 'going');
        this.maybeUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => x.rsvp == 'maybe');
        this.cantgoUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => x.rsvp == 'cantgo');
        this.noreplyUserEvents = x?.data?.event?.event?.usersConnection?.filter(x => !x.rsvp);
      }, err => this.handleError(err)),
      usersPeopleQueryRef?.valueChanges?.subscribe(result => {
        this.persons = result;
        this.notYetInvitedPeople = result?.data?.usersPeople?.filter(person => {
          return !this.userEventQueryResult?.data?.event?.event?.usersConnection
            ?.find(x => x.user?.id === person?.id);
        }) as any;
      }, err => this.handleError(err))
    );
  }

  async ionViewDidEnter() {
    this.queryRefs.forEach(queryRef => queryRef.startPolling(3000));
  }

  async ionViewDidLeave() {
    this.queryRefs.forEach(queryRef => queryRef.stopPolling());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async handleError(err) {
    await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    this.loading = false;
  }

  trackByUser(index: any, joinUserEvent: JoinUserEvent) {
    return joinUserEvent.userId;
  }

  openPhone(event: Event, number: string) {
    event.stopPropagation();
    this.communcationService.openPhone(number);
  }

  openSms(event: Event, number: string) {
    event.stopPropagation();
    this.communcationService.openSms(number);
  }

  async requestRide(userEvent: JoinUserEvent) {
    this.navigationService.requestUber(this.locationService.location, userEvent.event, userEvent.event.name);
  }

  goToHubPage(id: number) {
    this.navCtrl.navigateForward('hub/' + id);
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
    this.navigationService.navigate(this.locationService.location, userEvent.event)
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
