import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { JoinUserEvent, UserEventsGQL, UserEventsQuery } from 'src/graphql/graphql';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  queryRefs: QueryRef<any>[] = [];
  filter = '';
  userEventsQueryResult: ApolloQueryResult<UserEventsQuery>;
  filteredEvents: UserEventsQuery['usersEvents'];
  sortedEvents: UserEventsQuery['usersEvents'];
  upcomingEvents: UserEventsQuery['usersEvents'];
  elapsedEvents: UserEventsQuery['usersEvents'];

  loading: boolean = true;

  constructor(
    public navCtrl: NavController,
    private readonly userEvents: UserEventsGQL,
  ) { }

  ngOnInit() {
    const userEventsQueryRef = this.userEvents.watch(null, { pollInterval: 3000 });
    this.queryRefs.push(userEventsQueryRef);

    this.subscriptions.push(
      userEventsQueryRef?.valueChanges?.subscribe(result => {
        this.userEventsQueryResult = result;
        this.loading = result.loading;
        if (this.userEventsQueryResult?.data?.usersEvents) {
          this.sortedEvents = [...this.userEventsQueryResult?.data?.usersEvents]?.sort(
            (a, b) => new Date(b?.event?.startDateTime).valueOf() - new Date(a?.event?.startDateTime).valueOf()
          );
          this.upcomingEvents = this.sortedEvents?.filter(userEvents => (
            new Date().valueOf() <= new Date(userEvents?.event?.startDateTime).valueOf()
          )).sort(
            (a, b) => new Date(a?.event?.startDateTime).valueOf() - new Date(b?.event?.startDateTime).valueOf()
          );
          this.elapsedEvents = this.sortedEvents?.filter(userEvents => (
            new Date().valueOf() > new Date(userEvents?.event?.startDateTime).valueOf()
          ));
        }
      })
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

  goToCreateEventPage() {
    this.navCtrl.navigateForward('create-event');
  }

  trackByEvent(index: any, joinUserEvent: JoinUserEvent) {
    return joinUserEvent.eventId;
  }

  filterEvents(ev: any) {
    this.filter = ev.target.value;
    console.log('here')

    if (this.filter && this.filter.trim() !== '') {
      this.filteredEvents = this.sortedEvents?.filter(x => {
        const name = x?.event?.name?.trim()?.toLowerCase();
        return name?.includes(this.filter?.trim()?.toLowerCase());
      }).sort(
        (a, b) => new Date(b?.event?.startDateTime).valueOf() - new Date(a?.event?.startDateTime).valueOf()
      );
    }
  }

}
