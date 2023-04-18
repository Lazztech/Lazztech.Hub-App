import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Hub, UserEventsGQL, UserEventsQuery, UsersHubsGQL, UsersHubsQuery } from '../../../graphql/graphql';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  loading = false;
  subscriptions: Array<Subscription> = [];
  queryRefs: QueryRef<any>[] = [];
  center: any;
  locations: Array<any>;

  userHubs: UsersHubsQuery['usersHubs'];
  userEventsQueryResult: ApolloQueryResult<UserEventsQuery>;
  filteredEvents: UserEventsQuery['usersEvents'];
  sortedEvents: UserEventsQuery['usersEvents'];
  upcomingEvents: UserEventsQuery['usersEvents'];
  elapsedEvents: UserEventsQuery['usersEvents'];

  constructor(
    public locationService: LocationService,
    private readonly userHubsGQLService: UsersHubsGQL,
    private readonly userEvents: UserEventsGQL,
  ) {}

  ngOnInit(): void {
    const userHubsQueryRef = this.userHubsGQLService.watch(null, { pollInterval: 3000 });
    // const userEventsQueryRef = this.userEvents.watch(null, { pollInterval: 3000 });
    this.queryRefs.push(
      userHubsQueryRef,
      // userEventsQueryRef
    );

    this.subscriptions.push(
      userHubsQueryRef.valueChanges.subscribe(x => {
        this.loading = x.loading;
        this.userHubs = [...x?.data?.usersHubs]?.filter(x => x.hub);
        this.locations = [...this.userHubs?.map(x => x.hub as Hub), ...this.upcomingEvents?.filter(x => x.event)?.map(x => x.event)];
      }),
      // userEventsQueryRef?.valueChanges?.subscribe(result => {
      //   this.userEventsQueryResult = result;
      //   this.loading = result.loading;
      //   if (this.userEventsQueryResult?.data?.usersEvents) {
      //     this.sortedEvents = [...this.userEventsQueryResult?.data?.usersEvents]?.sort(
      //       (a, b) => new Date(b?.event?.startDateTime).valueOf() - new Date(a?.event?.startDateTime).valueOf()
      //     );
      //     this.upcomingEvents = this.sortedEvents?.filter(userEvents => (
      //       new Date().valueOf() <= new Date(userEvents?.event?.startDateTime).valueOf()
      //     )).sort(
      //       (a, b) => new Date(a?.event?.startDateTime).valueOf() - new Date(b?.event?.startDateTime).valueOf()
      //     );
      //     this.elapsedEvents = this.sortedEvents?.filter(userEvents => (
      //       new Date().valueOf() > new Date(userEvents?.event?.startDateTime).valueOf()
      //     ));

      //     this.locations = [...this.userHubs?.map(x => x.hub as Hub), ...this.upcomingEvents?.filter(x => x.event)?.map(x => x.event)];
      //   }
      // })
    )
  }

  async ionViewDidEnter() {
    this.queryRefs.forEach(queryRef => queryRef.startPolling(3000));
  }

  async ionViewDidLeave() {
    this.queryRefs.forEach(queryRef => queryRef.stopPolling());
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(x => x.unsubscribe());
  }

  onSearchSelected(event: { latitude: number, longitude: number }) {
    console.log('onSearchSelected');
    this.center = event;
  }

  onMapLoading(loading: boolean) {
    this.loading = loading;
  }
}
