import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HubService } from 'src/app/services/hub/hub.service';
import { Scalars, User } from 'src/generated/graphql';
import { ActionSheetController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit, OnDestroy {

  loading = false;
  queryParamsSubscription: Subscription;
  id: Scalars['ID'];
  user: User;
  blocked = false;

  userHubs = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hubService: HubService,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public userService: UserService,
  ) {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
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

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

  async presentActionSheet() {
      const actionSheet = await this.actionSheetController.create({
        header: 'User Options',
        buttons: [
          {
            text: this.blocked ? 'Unblock user' : 'Block user',
            role: 'destructive',
            handler: async () => {
              this.loading = true;
              if (this.blocked) {
                this.userService.unblockUser(this.id)
                  .then(() => this.loading = false);
              } else {
                this.userService.blockUser(this.id)
                  .then(() => this.loading = false);
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
