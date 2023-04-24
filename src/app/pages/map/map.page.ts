import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { MaplibreComponent } from 'src/app/components/maplibre/maplibre.component';
import { Hub, JoinUserEvent, JoinUserHub, UserEventsGQL, UserEventsQuery, UsersHubsGQL, UsersHubsQuery } from '../../../graphql/graphql';
import { LocationService } from '../../services/location/location.service';
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
  @ViewChild(IonContent, { static: true }) private content: IonContent;
  modalStyle: any;
  isOpen = true;
  initialMode: 'hubs' | 'events' | 'both' = 'hubs';
  sortedEvents: UserEventsQuery['usersEvents'];

  constructor(
    public locationService: LocationService,
    private readonly userHubsGQLService: UsersHubsGQL,
    private readonly userEvents: UserEventsGQL,
  ) {}

  async ngOnInit(): Promise<void> {
    this.content.getScrollElement().then(scrollElement => {
      this.modalStyle = {
        '--width': `${scrollElement.clientWidth}px`,
        'left': 0
      };
    });

    const padding = 20;
    const searchBarHeightPixes = 60;
    const screenHeight = window.screen.height;
    const percentage = (screenHeight - (searchBarHeightPixes + padding)) / screenHeight; // 0.92%
    console.log(percentage)
    this.modalInitialBreakpoint = percentage / 10;

    const userHubsQueryRef = this.userHubsGQLService.watch(null, { pollInterval: 3000 });
    const userEventsQueryRef = this.userEvents.watch(null, { pollInterval: 3000 });
    this.queryRefs.push(
      userHubsQueryRef,
      userEventsQueryRef,
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
        this.locations = [...this.userHubs?.map(x => x.hub as Hub)];
      }),
      userEventsQueryRef?.valueChanges?.subscribe(result => {
        this.loading = result.loading;
        if (result?.data?.usersEvents) {
          this.sortedEvents = [...result?.data?.usersEvents]?.sort(
            (a, b) => new Date(b?.event?.startDateTime).valueOf() - new Date(a?.event?.startDateTime).valueOf()
          );
        }
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
    }, 1000);
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

  searchItemClick(join: any) {
    this.map.flyTo(join.hub || join.event);
  }

  filterHubs(ev: any) {
    this.filter = ev.target.value;
  }

  isFiltered(join: any) {
    if (this.filter && this.filter.trim() !== '') {
      const entity = join?.hub || join?.event;
      const name = entity?.name.trim().toLowerCase();
      return !name.includes(this.filter.trim().toLowerCase());
    }
  }

  async segmentChanged(event) {
    this.initialMode = event?.detail?.value;
    if (this.initialMode === 'hubs') {
      this.locations = [...this.userHubs?.map(x => x.hub as Hub)];
    } else if (this.initialMode === 'events') {
      this.locations = [...this.sortedEvents?.map(x => x.event)];
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
