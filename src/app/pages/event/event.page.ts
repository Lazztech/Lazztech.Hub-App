import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { ActionSheetController, IonRouterOutlet, isPlatform, NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { NGXLogger } from 'ngx-logger';
import { combineLatest, Subscription } from 'rxjs';
import { InviteComponent } from 'src/app/components/invite/invite.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { EventGQL, EventQuery, JoinUserEvent, ReportEventAsInappropriateGQL, Scalars, User, UsersPeopleQuery } from 'src/graphql/graphql';
import { InviteContext } from '../qr/qr.page';
import * as ics from 'ics';

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
    private readonly calendar: Calendar,
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
      combineLatest([eventQueryRef?.valueChanges, usersPeopleQueryRef?.valueChanges]).subscribe(result => {
        this.persons = result[1];
        this.notYetInvitedPeople = result[1]?.data?.usersPeople?.filter(person => {
          return !result[0]?.data?.event?.event?.usersConnection
            ?.some(x => x.user?.id === person?.id);
        }) as any;
      }, err => this.handleError(err)),
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

  async promptToAddEventToCalendar() {
    if (confirm('Add to Calendar?')) {
      await this.addEventToCalendar();
    }
  }

  async addEventToCalendar() {
    try {
      if (isPlatform('hybrid')) {
        const result = await this.calendar.createEventInteractivelyWithOptions(
          this.userEventQueryResult?.data?.event?.event?.name,
          this.userEventQueryResult?.data?.event?.event?.locationLabel,
          this.userEventQueryResult?.data?.event?.event?.description,
          new Date(this.userEventQueryResult?.data?.event?.event?.startDateTime),
          new Date(this.userEventQueryResult?.data?.event?.event?.endDateTime),
          {
            firstReminderMinutes: 180, // 3 hours before
            url: 'https://hub.lazz.tech/event/' + this.userEventQueryResult?.data?.event?.event?.shareableId,
          }
        );
        console.log(result)
        await this.alertService.presentToast('Added to Calendar');
      } else {
        // TODO: finish ics export
        return;
        const event = ics.createEvent({
          start: [2018, 5, 30, 6, 30],
          duration: { hours: 6, minutes: 30 },
          title: this.userEventQueryResult?.data?.event?.event?.name,
          description: this.userEventQueryResult?.data?.event?.event?.description || '',
          location: this.userEventQueryResult?.data?.event?.event?.locationLabel || '',
          url: 'https://hub.lazz.tech/event/' + this.userEventQueryResult?.data?.event?.event?.shareableId,
          busyStatus: 'BUSY',
          organizer: { 
            name: `${this.userEventQueryResult?.data?.event?.event?.createdBy?.firstName} ${this.userEventQueryResult?.data?.event?.event?.createdBy?.lastName}`, 
            email: `${this.userEventQueryResult?.data?.event?.event?.createdBy?.email}` 
          },
        });
        console.log(event.value);
        const blob = new Blob([event.value], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = 'download.ics';
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 0);
        await this.alertService.presentToast('Added to Calendar');
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async presentActionSheet() {
    const buttons = [];

    // TODO: finish ics export
    if (isPlatform('hybrid')) {
      buttons.push({
        text: 'Add to Calendar',
        handler: () => {
          this.addEventToCalendar();
        }
      });
    }

    if (this.userEventQueryResult?.data?.event?.event?.createdBy?.id == (await this.authService.user())?.id) {
      buttons.push({
        text: 'Manage Event',
        handler: () => {
          this.navCtrl.navigateForward('admin-event/' + this.id);
        }
      });
      buttons.push({
        text: 'Copy Event',
        handler: () => {
          this.navCtrl.navigateForward('create-event', {
            state: {
              seed: this.userEventQueryResult?.data?.event?.event,
            }
          });
        }
      })
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

  async goToQrPage() {
    this.navCtrl.navigateForward('qr', {
      state: {
        data: 'https://hub.lazz.tech/event/' + this.userEventQueryResult?.data?.event?.event?.shareableId,
        shareableLink: 'https://hub.lazz.tech/event/' + this.userEventQueryResult?.data?.event?.event?.shareableId,
        title: this.userEventQueryResult?.data?.event?.event?.name,
        subtitle: this.userEventQueryResult?.data?.event?.event?.locationLabel ? 'Scan to join event @ ' + this.userEventQueryResult?.data?.event?.event?.locationLabel : 'Scan to join event',
        image: this.userEventQueryResult?.data?.event?.event?.image,
        inviteContext: {
          type: 'event',
          id: this.userEventQueryResult?.data?.event?.event?.id
        } as InviteContext,
      }
    });
  }

}
