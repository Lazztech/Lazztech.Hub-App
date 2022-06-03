import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { JoinUserEvent, UserEventsGQL, UserEventsQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

  demoEvent: JoinUserEvent = {
    userId: "1",
    eventId: "1",
    event: {
      id: "1",
      name: "My First Demo Event",
      shareableId: "1",
      image: "https://lazztech-hub-service-z84zo.ondigitalocean.app/file/bb06c3e0-cd60-11ec-8708-ab51b4e23219.jpg",
    }
  }

  subscriptions: Subscription[] = [];
  userEventsQueryResult: ApolloQueryResult<UserEventsQuery>;
  sortedEvents: UserEventsQuery['usersEvents'];

  constructor(
    public navCtrl: NavController,
    private readonly userEvents: UserEventsGQL,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.userEvents.watch(null,{
        pollInterval: 2000,
      }).valueChanges.subscribe(x => {
        this.userEventsQueryResult = x;
        if (this.userEventsQueryResult?.data?.usersEvents) {
          this.sortedEvents = [...this.userEventsQueryResult?.data?.usersEvents]?.sort(
            (a, b) => new Date(b?.event?.startDateTime).valueOf() - new Date(a?.event?.startDateTime).valueOf()
          );
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
