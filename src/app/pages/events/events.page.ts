import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserEventsGQL, UserEventsQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
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
    this.subscriptions.push(
      this.userEvents.watch(null,{
        pollInterval: 2000,
      }).valueChanges.subscribe(result => {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  goToCreateEventPage() {
    this.navCtrl.navigateForward('create-event');
  }

}
