import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { Observable, Subscription } from 'rxjs';
import { Scalars, UsersPeopleQuery } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit, OnDestroy {

  loading = false;
  allInvitesSucces = true;
  invites: Array<{name?: string, email: string}> = []
  myForm: FormGroup;
  id: Scalars['ID'];
  persons: Observable<UsersPeopleQuery['usersPeople']>;
  subscriptions: Subscription[] = [];

  get email() {
    return this.myForm.get('email');
  }

  constructor(
    private hubService: HubService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private logger: NGXLogger,
    public navCtrl: NavController,
  ) { }
 
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
    });
    
    this.persons = this.hubService.watchUsersPeople().valueChanges.pipe(map(x => x?.data && x?.data?.usersPeople));

    this.subscriptions.push(
      this.hubService.watchUsersPeople().valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;
      })
    );
  }

  checkboxChanged(person) {
    let invitee = { name: person.firstName, email: person.email };
    if (this.invites.filter(i => i.email === invitee.email).length > 0){
      const i = this.invites.findIndex(i => i.email === invitee.email);
      this.invites.splice(i, 1);
    } else {
      this.invites.push(invitee);
    }
    console.log(this.invites)
  }
  ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
  }

  async sendInvites(): Promise<string> {
    let invited: string = '';
    console.log(this.invites)
    await Promise.all(
      this.invites.map(async invite => {
       const result = await this.hubService.inviteUserToHub(this.id, invite.email);
        if (result) {
           invited = invited.concat(`${result?.invitee?.firstName}, `);
        } else {
          this.allInvitesSucces = false;
        }
      })
      )
      return invited;
  }

  async inviteUser() {
    this.loading = true;
    if (this.myForm.valid) this.invites.push(this.myForm.value)
    let invited = await this.sendInvites();
    if (invited !== '') {
      this.alertService.presentToast(`${invited.slice(0, invited.length - 2)} have been sucessfully invited`)
      this.loading = false;
    }
    if (this.allInvitesSucces) this.navCtrl.back();
    this.loading = false;
    this.invites = [];
  }
}
