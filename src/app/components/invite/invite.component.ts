import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { InviteUserToEventGQL, Scalars, User } from 'src/graphql/graphql';

export enum InviteType {
  Hub = 'hub',
  Event = 'event',
}

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent implements OnInit, OnChanges {

  @Input() persons: Array<User> = [];
  @Input() inviteType: InviteType;
  @Input() id: Scalars['ID'];
  @Input() shareableLink: string;

  loading = false;
  allInvitesSucces = true;
  invites: Array<{ name?: string, email: string }> = [];
  myForm: UntypedFormGroup;

  get email() {
    return this.myForm.get('email');
  }

  constructor(
    private readonly hubService: HubService,
    private readonly fb: UntypedFormBuilder,
    private readonly alertService: AlertService,
    private readonly route: ActivatedRoute,
    private readonly logger: NGXLogger,
    private readonly navCtrl: NavController,
    private readonly inviteUserToEventService: InviteUserToEventGQL,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  async copyShareLink() {
    await Clipboard.write({
      string: this.shareableLink
    });
    await this.alertService.presentToast('Copied Shareable Link');
  }

  async share() {
    await Share.share({
      url: this.shareableLink,
      dialogTitle: 'Shareable Link',
    });
  }

  checkboxChanged(person) {
    const invitee = { name: person.firstName, email: person.email };
    if (this.invites.filter(x => x.email === invitee.email).length) {
      const i = this.invites.findIndex(x => x.email === invitee.email);
      this.invites.splice(i, 1);
    } else {
      this.invites.push(invitee);
    }
  }

  async sendInvites(): Promise<string> {
    let invited = '';
    await Promise.all(
      this.invites.map(async invite => {
        if (this.inviteType == InviteType.Hub) {
          const result = await this.hubService.inviteUserToHub(this.id, invite.email);
          if (result) {
            invited = invited.concat(`${result?.invitee?.firstName}, `);
          } else {
            this.allInvitesSucces = false;
          }
        } else if (this.inviteType == InviteType.Event) {
          const result = await this.inviteUserToEventService.mutate({
            eventId: this.id,
            inviteesEmail: invite.email,
          }).toPromise();
          if (result) {
            invited = invited.concat(`${result?.data?.inviteUserToEvent?.user?.firstName}, `);
          } else {
            this.allInvitesSucces = false;
          }
        }
      })
    );
    return invited;
  }

  async inviteUser() {
    this.loading = true;
    if (this.myForm.valid) { this.invites.push(this.myForm.value); }
    const invited = await this.sendInvites();
    this.loading = false;
    if (invited !== '') {
      this.alertService.presentToast(`${invited.slice(0, invited.length - 2)} have been sucessfully invited`);
    }
    if (this.allInvitesSucces) { this.navCtrl.back(); }
    this.invites = [];
  }

}
