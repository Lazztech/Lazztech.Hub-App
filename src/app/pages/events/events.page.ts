import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { UserEventsGQL, UserEventsQuery } from 'src/graphql/graphql';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  queryRefs: QueryRef<any>[] = [];

  userEventsQueryResult: ApolloQueryResult<UserEventsQuery>;
  sortedEvents: UserEventsQuery['usersEvents'];
  upcomingEvents: UserEventsQuery['usersEvents'];
  elapsedEvents: UserEventsQuery['usersEvents'];

  public get loading() : boolean {
    return [
      this.userEventsQueryResult,
    ].some(x => x?.loading);
  }

  constructor(
    public navCtrl: NavController,
    private readonly userEvents: UserEventsGQL,
  ) { }

  ngOnInit() {
    const userEventsQueryRef = this.userEvents.watch(null, { pollInterval: 3000 });
    this.queryRefs.push(userEventsQueryRef);

    this.subscriptions.push(
      userEventsQueryRef.valueChanges.subscribe(result => {
        this.userEventsQueryResult = result;
        if (this.userEventsQueryResult?.data?.usersEvents) {
          this.sortedEvents = [...this.userEventsQueryResult?.data?.usersEvents]?.sort(
            (a, b) => new Date(b?.event?.startDateTime).valueOf() - new Date(a?.event?.startDateTime).valueOf()
          );
          this.upcomingEvents = this.sortedEvents?.filter(userEvents => (
            new Date().valueOf() <= new Date(userEvents?.event?.startDateTime).valueOf()
          ));
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

}
