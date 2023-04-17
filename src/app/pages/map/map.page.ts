import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Hub, UsersHubsGQL, UsersHubsQuery } from '../../../graphql/graphql';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  loading = false;
  subscriptions: Array<Subscription> = [];
  center: any;
  locations: Array<any>;
  userHubs: UsersHubsQuery['usersHubs'];

  constructor(
    public locationService: LocationService,
    private readonly userHubsGQLService: UsersHubsGQL,
  ) {}

  ngOnInit(): void {
    const userHubsQueryRef = this.userHubsGQLService.watch(null, { pollInterval: 3000 });
    this.subscriptions.push(
      userHubsQueryRef.valueChanges.subscribe(x => {
        this.loading = x.loading;
        this.userHubs = [...x?.data?.usersHubs]?.filter(x => x.hub);
        this.locations = this.userHubs?.map(x => x.hub as Hub);
      }),
    )
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
