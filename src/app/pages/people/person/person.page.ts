import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HubService } from 'src/app/services/hub/hub.service';
import { Scalars, User } from 'src/graphql/graphql';
import { ActionSheetController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit, OnDestroy {

  loading = false;
  queryParamsSubscription: Subscription;
  id: Scalars['ID']['output'];
  user: User;
  subscriptions: Subscription[] = [];

  userHubs = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hubService: HubService,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public userService: UserService,
    public locationService: LocationService,
    private changeRef: ChangeDetectorRef,
  ) {
    this.subscriptions.push(this.route.queryParams.subscribe(params => {
        this.user = this.router.getCurrentNavigation()?.extras?.state?.user;
    }));
    this.id = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit() {
    this.loading = true;
    this.userHubs = await this.hubService.commonUsersHubs(this.id);
    this.loading = false;
  }

  goToHubPage(id: number) {
    this.navCtrl.navigateForward('hub/' + id);
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
  }

  async presentActionSheet() {
      const actionSheet = await this.actionSheetController.create({
        header: 'User Options',
        buttons: [
          {
            text: this.user.blocked ? 'Unblock user' : 'Block user',
            role: 'destructive',
            handler: async () => {
              this.loading = true;
              if (this.user.blocked) {
                this.userService.unblockUser(this.id)
                  .then(async () => {
                    this.loading = false;
                    this.user = { ...this.user, blocked: false };
                    await this.hubService.usersPeople('network-only');
                  });
              } else {
                this.userService.blockUser(this.id)
                  .then(async () => {
                    this.loading = false;
                    this.user = { ...this.user, blocked: true };
                    await this.hubService.usersPeople('network-only');
                  });
              }
            }
          },
          {
            text: 'Report as Inappropriate',
            role: 'destructive',
            handler: () => {
              if (confirm('Report as Inappropriate? This may result in the removal of data & the offending content creator.')) {
                this.loading = true;
                this.userService.reportAsInappropriate(this.id).then(() => {
                  this.loading = false;
                  this.navCtrl.back();
                });
              }
            }
          },
          {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }]
      });
      await actionSheet.present();
  }

}
