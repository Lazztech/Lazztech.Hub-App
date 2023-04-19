import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Hub, UsersHubsGQL, UsersHubsQuery } from '../../../graphql/graphql';
import { LocationService } from '../../services/location/location.service';
import _ from 'lodash-es';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  loading = false;
  subscriptions: Array<Subscription> = [];
  queryRefs: QueryRef<any>[] = [];

  locations: Array<any>;
  center: any = this.locationService.getCurrentPosition().then(x => x.coords);

  userHubs: UsersHubsQuery['usersHubs'];

  constructor(
    public locationService: LocationService,
    private readonly userHubsGQLService: UsersHubsGQL,
  ) {}

  ngOnInit(): void {
    const userHubsQueryRef = this.userHubsGQLService.watch(null, { pollInterval: 3000 });
    this.queryRefs.push(
      userHubsQueryRef,
    );

    this.subscriptions.push(
      userHubsQueryRef.valueChanges.subscribe(x => {
        this.loading = x.loading;
        this.userHubs = [...x?.data?.usersHubs]?.filter(x => x.hub);
        this.locations = this.userHubs?.map(x => x.hub as Hub);
      }),
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
