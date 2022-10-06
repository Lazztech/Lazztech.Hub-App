import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserEventsGQL, UserEventsQuery } from 'src/graphql/graphql';

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
  days: string;
  dateTimeSelected: any;

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
          this.calculateDayValues();
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

  calculateDayValues() {
    const usersEvents = this.userEventsQueryResult?.data?.usersEvents;
    const selection = this.dateTimeSelected || new Date();
    this.days = usersEvents
      ?.filter(usersEvent => 
        new Date(usersEvent?.event?.startDateTime)?.getMonth() == new Date(selection)?.getMonth()
      )
      ?.map(usersEvent => new Date(usersEvent?.event?.startDateTime).getDate().toString())
      ?.reduce((previousValue, currentValue) => `${previousValue},${currentValue}`, '');
    console.log(this.days);
  }

  dateTimeChanged(event: any) {
    console.log(event?.detail?.value);
    this.dateTimeSelected = event?.detail?.value;
    this.calculateDayValues();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  goToCreateEventPage() {
    this.navCtrl.navigateForward('create-event');
  }

}
