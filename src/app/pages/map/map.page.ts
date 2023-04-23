import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Hub, UsersHubsGQL, UsersHubsQuery } from '../../../graphql/graphql';
import { LocationService } from '../../services/location/location.service';
import _ from 'lodash-es';
import { Position } from '@capacitor/geolocation';
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
  center: any = this.locationService?.position?.coords;
  userHubs: UsersHubsQuery['usersHubs'];
  modalInitialBreakpoint: number;

  isOpen = true;

  constructor(
    public locationService: LocationService,
    private readonly userHubsGQLService: UsersHubsGQL,
  ) {}

  async ngOnInit(): Promise<void> {
    const padding = 20;
    const searchBarHeightPixes = 60;
    const screenHeight = window.screen.height;
    const percentage = (screenHeight - (searchBarHeightPixes + padding)) / screenHeight; // 0.92%
    console.log(percentage)
    this.modalInitialBreakpoint = percentage / 10;

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

  async ionViewWillEnter() {
    this.isOpen = true;
  }

  async ionViewDidEnter() {
    this.queryRefs.forEach(queryRef => queryRef.startPolling(3000));
    this.isOpen = true;
  }

  async ionViewWillLeave() {
    this.isOpen = false;
  }

  async ionViewDidLeave() {
    this.isOpen = false;
    this.queryRefs.forEach(queryRef => queryRef.stopPolling());
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(x => x.unsubscribe());
  }

  toggleModal() {
    this.isOpen = !this.isOpen;
  }

  didDismissModal() {
    this.isOpen = false;
  }

  didPresentModal() {
    this.isOpen = true;
  }

  onSearchSelected(event: { latitude: number, longitude: number }) {
    console.log('onSearchSelected');
    this.center = event;
  }

  onMapLoading(loading: boolean) {
    this.loading = loading;
  }
}
