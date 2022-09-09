import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { HubService } from 'src/app/services/hub/hub.service';
import { InviteQuery, Scalars } from 'src/graphql/graphql';

@Component({
  selector: 'app-preview-hub',
  templateUrl: './preview-hub.page.html',
  styleUrls: ['./preview-hub.page.scss'],
})
export class PreviewHubPage implements OnInit, OnDestroy {

  loading = true;
  invite: Observable<InviteQuery['invite']>;
  subscriptions: Subscription[] = [];
  id: Scalars['ID'];
  hubCoords: {latitude: number, longitude: number};

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.invite = this.hubService.watchInvite(this.id).valueChanges.pipe(
      map(x => x.data && x.data.invite)
    );

    this.subscriptions.push(
      this.hubService.watchInvite(this.id).valueChanges.subscribe(x => {
        this.loading = x.loading;
      })
    );

    this.subscriptions.push(
      this.invite.subscribe(invite => {
        this.hubCoords = {
          latitude: invite.hub.latitude,
          longitude: invite.hub.longitude
        };
      })
    );
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async goToMap() {
    this.invite.pipe(take(1)).subscribe(invite => {
      this.navCtrl.navigateForward('map', {
        state: {
          hubCoords: this.hubCoords,
          hub: invite.hub
        }
      });
    });
  }

  async accept() {
    this.invite.pipe(take(1)).subscribe(async invite => {
      this.loading = true;
      await this.hubService.acceptHubInvite(invite.id);
      this.loading = false;
      this.navCtrl.back();
    });
  }

  async reject() {
    this.invite.pipe(take(1)).subscribe(async invite => {
      this.loading = true;
      await this.hubService.deleteInvite(invite.hubId, invite.id);
      this.loading = false;
      this.navCtrl.back();
    });
  }

}
