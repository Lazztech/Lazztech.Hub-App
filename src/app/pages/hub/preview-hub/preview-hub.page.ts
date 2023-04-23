import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ErrorService } from 'src/app/services/error.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { InviteQuery, Scalars } from 'src/graphql/graphql';

@Component({
  selector: 'app-preview-hub',
  templateUrl: './preview-hub.page.html',
  styleUrls: ['./preview-hub.page.scss'],
})
export class PreviewHubPage implements OnInit, OnDestroy {

  loading = true;
  invite: InviteQuery['invite'];
  subscriptions: Subscription[] = [];
  id: Scalars['ID'];
  hubCoords: {latitude: number, longitude: number};

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    public navCtrl: NavController,
    private readonly errorService: ErrorService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.subscriptions.push(
      this.hubService.watchInvite(this.id).valueChanges.subscribe(x => {
        this.loading = x.loading;
        this.invite = x.data.invite;

        this.hubCoords = {
          latitude: this.invite.hub.latitude,
          longitude: this.invite.hub.longitude
        };
      }, err => this.errorService.handleError(err, this.loading))
    );
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async goToMap() {
    this.navCtrl.navigateForward('map', {
      state: {
        hubCoords: this.hubCoords,
        hub: this.invite.hub
      }
    });
  }

  async accept() {
    try {
      this.loading = true;
      await this.hubService.acceptHubInvite(this.invite.id);
      this.loading = false;
      this.navCtrl.back();
    } catch (error) {
      this.errorService.handleError(error, this.loading);
    }
  }

  async reject() {
    try {
      this.loading = true;
      await this.hubService.deleteInvite(this.invite.hubId, this.invite.id);
      this.loading = false;
      this.navCtrl.back();
    } catch (error) {
      this.errorService.handleError(error, this.loading);
    }
  }

}
