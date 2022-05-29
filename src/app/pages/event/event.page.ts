import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HubService } from 'src/app/services/hub/hub.service';
import { LocationService } from 'src/app/services/location/location.service';
import { EventGQL, EventQuery, JoinUserEvent, ReportEventAsInappropriateGQL, Scalars, UsersPeopleQuery } from 'src/generated/graphql';

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
  userCoords: {latitude: number, longitude: number};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly hubService: HubService,
    private readonly eventService: EventGQL,
    private readonly reportEventAsInappropriateService: ReportEventAsInappropriateGQL,
    private readonly actionSheetController: ActionSheetController,
    private readonly navCtrl: NavController,
    private readonly logger: NGXLogger,
    private readonly locationService: LocationService,
    private readonly changeRef: ChangeDetectorRef,
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
      this.locationService.coords$.subscribe(async x => {
        this.userCoords = { latitude: x.latitude, longitude: x.longitude };
        this.changeRef.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }


  trackByUser(index: any, joinUserEvent: JoinUserEvent) {
    return joinUserEvent.userId;
  }

  async requestRide(userEvent: JoinUserEvent) {
    // tslint:disable-next-line:max-line-length
    window.open(`uber://?client_id=<CLIENT_ID>&action=setPickup&pickup[latitude]=${this.userCoords.latitude}&pickup[longitude]=${this.userCoords.longitude}&pickup[nickname]=Your%20Location&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=${userEvent.event.latitude}&dropoff[longitude]=${userEvent.event.longitude}&dropoff[nickname]=${userEvent.event.name}%20Hub&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383`);
  }

  async presentActionSheet() {

      const buttons = [];
        buttons.push(
        {
          text: 'Report as Inappropriate',
          role: 'destructive',
          handler: () => {
            if (confirm('Report as Inappropriate? This may result in the removal of data & the offending content creator.')) {
              this.loading = true;
              this.reportEventAsInappropriateService.mutate({
                eventId: this.id
              }).toPromise().then(() => {
                this.loading = false;
                this.navCtrl.back();
              });
            }
          }
        });

      const actionSheet = await this.actionSheetController.create({
        header: 'Event Options',
        buttons: [
          ...buttons,
          {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.logger.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
  }

}
