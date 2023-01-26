import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { InviteContext } from 'src/app/pages/qr/qr.page';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { InviteUserToEventGQL, Scalars, User } from 'src/graphql/graphql';

export enum InviteType {
  Hub = 'hub',
  Event = 'event',
}

export type AlphabetMapOfUsers = {
  [letter: string]: Array<User>;
};

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
  @Input() qrData: string;
  @Input() qrTitle: string;
  @Input() qrSubtitle: string;
  @Input() qrImage: string;
  @Input() modal: any;

  loading = false;
  allInvitesSucces = true;
  invites: Array<{ name?: string, email: string }> = [];
  myForm: UntypedFormGroup;
  filter: string = '';
  filteredPersons: Array<User> = [];
  alphabetizedPersons: AlphabetMapOfUsers;
  showPeopleFrom: 'all-people' | 'events-i-hosted' | 'events-i-attended' | 'hubs-i-created' | 'hubs-im-a-member-of' = 'all-people';

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
    this.alphabetizedPersons = this.alphabetizePersons(
      this.persons
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
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

  showPeopleFromChanged(ev) {
    this.showPeopleFrom = ev.target.value;
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

  async goToQrPage() {
    await this.modal?.dismiss();
    this.navCtrl.navigateForward('qr', {
      state: {
        data: this.qrData,
        title: this.qrTitle,
        subtitle: this.qrSubtitle,
        image: this.qrImage,
        initialMode: 'scan-code',
        inviteContext: {
          type: this.inviteType,
          id: this.id,
        } as InviteContext,
      }
    });
  }

  personIsFiltered(person: User) {
    if (this.filter && this.filter?.trim() !== '') {
      const name = person?.firstName?.trim()?.toLowerCase() + person?.lastName?.trim()?.toLowerCase();
      return !name.includes(this.filter?.trim().toLowerCase());
    }

    return false;
  }

  async filterPeople(ev: any) {
    this.filter = ev?.target?.value;
  }

  alphabetizePersons(persons: Array<User>): AlphabetMapOfUsers {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let alphabetArray = alphabet.split('');
    const alphabetizedPersons = [...persons]?.sort((a, b) => (
      a?.lastName.toLowerCase().localeCompare(b?.lastName.toLowerCase())
    ));
    console.log(alphabetizedPersons);
    const alphabetMap = <AlphabetMapOfUsers>{};
    alphabetArray.forEach(letter => {
      const startsWithLetter = alphabetizedPersons.filter(person => person?.lastName?.toLowerCase()?.startsWith(letter));
      alphabetMap[letter] = startsWithLetter;
    });
    // non alphabetical character for last name
    alphabetMap['#'] = alphabetizedPersons.filter(
      person => alphabet.indexOf(person?.lastName?.toLowerCase()[0]) == -1
    );
    return alphabetMap;
  }

}
