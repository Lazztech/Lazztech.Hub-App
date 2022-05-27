import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HubService } from 'src/app/services/hub/hub.service';
import { EventGQL, EventQuery, JoinUserEvent, Scalars, UsersPeopleQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {

  loading = false;
  id: Scalars['ID'];
  userEventQueryResult: ApolloQueryResult<EventQuery>;
  persons: Observable<UsersPeopleQuery['usersPeople']>;
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    private readonly eventService: EventGQL,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.persons = this.hubService.watchUsersPeople().valueChanges.pipe(map(x => x.data && x.data.usersPeople));
    this.subscriptions.push(
      this.eventService.watch({
        id: this.id
      }, {
        pollInterval: 2000,
      }).valueChanges.subscribe(x => {
        this.userEventQueryResult = x;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }


  trackByUser(index: any, joinUserEvent: JoinUserEvent) {
    return joinUserEvent.userId;
  }

}
