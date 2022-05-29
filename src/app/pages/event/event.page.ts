import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HubService } from 'src/app/services/hub/hub.service';
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly hubService: HubService,
    private readonly eventService: EventGQL,
    private readonly reportEventAsInappropriateService: ReportEventAsInappropriateGQL,
    private readonly actionSheetController: ActionSheetController,
    private readonly navCtrl: NavController,
    private readonly logger: NGXLogger,
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
