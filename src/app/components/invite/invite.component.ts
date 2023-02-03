import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { IonAccordionGroup, NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { InviteContext } from 'src/app/pages/qr/qr.page';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { InviteUserToEventGQL, JoinUserEvent, JoinUserHub, Scalars, User, UserEventsGQL, UsersHubsGQL, UsersHubsQuery } from 'src/graphql/graphql';

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
export class InviteComponent implements OnInit, OnDestroy, OnChanges {

  @Input() persons: Array<User> = [];
  @Input() inviteType: InviteType;
  @Input() id: Scalars['ID'];
  @Input() shareableLink: string;
  @Input() qrData: string;
  @Input() qrTitle: string;
  @Input() qrSubtitle: string;
  @Input() qrImage: string;
  @Input() modal: any;
  userHubs: UsersHubsQuery['usersHubs'];
  queryRefs: QueryRef<any>[] = [];
  subscriptions: Subscription[] = [];

  loading = false;
  allInvitesSucces = true;
  invites: Array<{ name?: string, email: string }> = [];
  myForm: UntypedFormGroup;
  filter: string = '';
  filteredPersons: Array<User> = [];
  alphabetizedPersons: AlphabetMapOfUsers;
  showPeopleFrom: 'all-people' | 'events-i-hosted' | 'events-im-invited-to' | 'hubs-im-an-admin-of' | 'hubs-im-a-member-of' = 'all-people';
  hubsImAnAdminOf: Array<JoinUserHub> = [];
  hubsImAMemberOf: Array<JoinUserHub> = [];
  eventsIHosted: Array<JoinUserEvent> = [];
  eventsImInvitedTo: Array<JoinUserEvent> = [];
  userId: any;
  eventFilter: JoinUserEvent;
  hubFilter: JoinUserHub;
  @ViewChild('filterAccordionGroup', { static: true }) filterAccordianGroup: IonAccordionGroup;

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
    private readonly userHubsGQLService: UsersHubsGQL,
    private readonly userEvents: UserEventsGQL,
    private readonly authService: AuthService,
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
    });
    this.alphabetizedPersons = this.alphabetizePersons(
      this.filterToValidToInvitePersons(this.persons)
    );
    const userHubsRef = this.userHubsGQLService.watch();
    const userEventsRef = this.userEvents.watch();
    this.queryRefs.push(
      userHubsRef,
      userEventsRef
    );

    this.userId = (await this.authService.user())?.id;

    this.subscriptions.push(
      userHubsRef.valueChanges.subscribe(result => {
        const userHubs = result?.data?.usersHubs;
        this.hubsImAnAdminOf = userHubs?.filter(x => x?.isOwner) as JoinUserHub[];
        this.hubsImAMemberOf = userHubs?.filter(x => !x?.isOwner) as JoinUserHub[];
      }),
      userEventsRef.valueChanges.subscribe(result => {
        const userEvents = result?.data?.usersEvents;
        this.eventsIHosted = userEvents.filter(x => {
          return x?.event?.createdBy?.id === this.userId
        }) as JoinUserEvent[];
        this.eventsImInvitedTo = userEvents.filter(x => {
          return x?.event?.createdBy?.id !== this.userId
        }) as JoinUserEvent[];
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy(): void {
    this.queryRefs?.forEach(x => x.stopPolling());
    this.subscriptions?.forEach(x => x.unsubscribe());
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
    this.eventFilter = undefined;
    this.hubFilter = undefined;
    if (this.showPeopleFrom !== 'all-people') {
      this.filterAccordianGroup.value = ['first'];
    } else {
      this.alphabetizedPersons = this.alphabetizePersons(
        this.filterToValidToInvitePersons(this.persons)
      );
      this.filterAccordianGroup.value = undefined;
    }
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
    if (this.showPeopleFrom !== 'all-people' && this.eventFilter) {
      return !this.eventFilter.event.usersConnection?.some(x => x.userId === person.id);
    } else if (this.showPeopleFrom !== 'all-people' && this.hubFilter) {
      return !this.hubFilter.hub.usersConnection?.some(x => x.userId === person.id);
    } else if (this.filter && this.filter?.trim() !== '') {
      const name = person?.firstName?.trim()?.toLowerCase() + person?.lastName?.trim()?.toLowerCase();
      return !name.includes(this.filter?.trim().toLowerCase());
    } else {
      return false;
    }
  }

  eventFilterClicked(userEvent: JoinUserEvent) {
    this.eventFilter = userEvent;
    this.alphabetizedPersons = this.alphabetizePersons(
      this.filterToValidToInvitePersons(userEvent?.event?.usersConnection?.map(x => x.user))
    );
    this.filterAccordianGroup.value = undefined;
  }

  hubFilterClicked(userHub: JoinUserHub) {
    this.hubFilter = userHub;
    this.alphabetizedPersons = this.alphabetizePersons(
      this.filterToValidToInvitePersons(userHub?.hub?.usersConnection?.map(x => x.user))
    );
    this.filterAccordianGroup.value = undefined;
  }

  async filterPeople(ev: any) {
    this.filter = ev?.target?.value;
  }

  filterToValidToInvitePersons(persons: Array<User>): Array<User> {
    // remove this user as they shouldn't be able to invite themselves
    const personsWithOutThisUser = persons.filter(x => x.id !== this.userId);
    // assuming the input persons are only those that haven't been invited already
    // they're the only valid options to show so we filter the input down to them
    return personsWithOutThisUser.filter(
      x => this.persons.some(y => y.id === x.id)
    );
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
