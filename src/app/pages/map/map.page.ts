import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Hub, JoinUserHub, UsersHubsGQL, UsersHubsQuery } from '../../../graphql/graphql';
import { LocationService } from '../../services/location/location.service';
import _ from 'lodash-es';
import { Position } from '@capacitor/geolocation';
import { MaplibreComponent } from 'src/app/components/maplibre/maplibre.component';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  loading = false;
  subscriptions: Array<Subscription> = [];
  @ViewChild(MaplibreComponent)
  map: MaplibreComponent;
  queryRefs: QueryRef<any>[] = [];
  locations: Array<any>;
  center: any = this.locationService?.position?.coords;
  userHubs: UsersHubsQuery['usersHubs'];
  modalInitialBreakpoint: number;
  filter = '';

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
        this.userHubs = [...x?.data?.usersHubs]?.filter(x => x.hub)?.sort((a, b) => {
          if (this?.locationService.location) {
            console.log('sorting');
            return this.locationService.getDistanceFromHub(a?.hub as Hub, this?.locationService.location) - this.locationService.getDistanceFromHub(b?.hub as Hub, this?.locationService.location);
          } else {
            return 1;
          }
        });
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
    setTimeout(() => {
      this.map.map.easeTo({
        pitch: 60,
        zoom: 11,
        duration: 2000
      });
    }, 1500);
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

  searchItemClick(userHub: JoinUserHub) {
    this.map.flyTo(userHub.hub)
  }

  filterHubs(ev: any) {
    this.filter = ev.target.value;
  }

  isFiltered(userHub: JoinUserHub) {
    if (this.filter && this.filter.trim() !== '') {
      const name = userHub.hub.name.trim().toLowerCase();
      return !name.includes(this.filter.trim().toLowerCase());
    }
  }

  onSearchSelected(event: { latitude: number, longitude: number }) {
    console.log('onSearchSelected');
    this.center = event;
  }

  onMapLoading(loading: boolean) {
    this.loading = loading;
  }
}
