import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { NavController } from '@ionic/angular';
import { QueryRef } from 'apollo-angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { ErrorService } from 'src/app/services/error.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { MeQuery, UsersPeopleGQL, UsersPeopleQuery } from 'src/graphql/graphql';

export type AlphabetMapOfUsers = {
  [letter: string]: UsersPeopleQuery['usersPeople'];
};

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit, OnDestroy {

  userResult: ApolloQueryResult<MeQuery>;
  personsResult: ApolloQueryResult<UsersPeopleQuery>;
  filteredPersons: ApolloQueryResult<UsersPeopleQuery>;
  alphabetizedPersons: AlphabetMapOfUsers;

  queryRefs: QueryRef<any>[] = [];
  subscriptions: Subscription[] = [];
  filter: string = '';

  loading = true;

  constructor(
    public navCtrl: NavController,
    public hubService: HubService,
    private logger: NGXLogger,
    private readonly communcationService: CommunicationService,
    private readonly usersPeopleGQLService: UsersPeopleGQL,
    private readonly errorService: ErrorService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit() {

    const usersPeopleQueryRef = this.usersPeopleGQLService.watch(null, { pollInterval: 3000 });
    const userQueryRef = this.authService.watchUser();

    this.queryRefs.push(usersPeopleQueryRef);

    this.subscriptions.push(
      userQueryRef.valueChanges.subscribe(result => {
        this.userResult = result;
        this.loading = result.loading;
      }, err => this.errorService.handleError(err, this.loading)),
      usersPeopleQueryRef.valueChanges.subscribe(result => {
        this.loading = result.loading;
        this.personsResult = result;
        this.alphabetizedPersons = this.alphabetizePersons(result?.data?.usersPeople);
      }, err => this.errorService.handleError(err, this.loading))
    );
  }

  async ionViewDidEnter() {
    this.queryRefs.forEach(queryRef => queryRef.startPolling(3000));
  }

  async ionViewDidLeave() {
    this.queryRefs.forEach(queryRef => queryRef.stopPolling());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
  }


  alphabetizePersons(persons: UsersPeopleQuery['usersPeople']): AlphabetMapOfUsers {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let alphabetArray = alphabet.split('');
    const alphabetizedPersons = [...persons]?.sort((a, b) => (
      a?.lastName?.toLowerCase().localeCompare(b?.lastName?.toLowerCase())
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

  async doRefresh(event) {
    this.logger.log('Begin async operation');
    this.personsResult = await this.usersPeopleGQLService.fetch(null, { fetchPolicy: 'network-only' }).toPromise();
    event.target.complete();
  }

  openPhone(event: Event, number: string) {
    event.stopPropagation();
    this.communcationService.openPhone(number);
  }

  openSms(event: Event, number: string) {
    event.stopPropagation();
    this.communcationService.openSms(number);
  }

  goToPersonPage(id: number, user: any) {
    this.logger.log(user);
    this.navCtrl.navigateForward('person/' + id, {
      state: {
        user
      }
    });
  }

  goToDiscoverPage() {
    this.navCtrl.navigateForward('discover');
  }

  async goToQrPage() {
    const user = await this.authService.user();
    this.navCtrl.navigateForward('qr', {
      state: {
        data: user?.shareableId,
        title: user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}` : undefined,
        subtitle: 'Scan to invite me',
        image: user?.image,
      }
    });
  }

  async goToProfilePage() {
    this.navCtrl.navigateForward('tabs/profile');
  }

  async filterPeople(ev: any) {
    this.filter = ev?.target?.value;
    if (this.filter && this.filter?.trim() !== '') {
      this.filteredPersons = {
        ...this.personsResult,
        data: {
          usersPeople: this.personsResult?.data?.usersPeople?.filter(usersPerson => {
            const name = usersPerson?.firstName?.trim()?.toLowerCase() + usersPerson?.lastName?.trim()?.toLowerCase();
            if (name) {
              return name.includes(this.filter?.trim()?.toLowerCase());
            }
            return usersPerson?.username?.trim().toLocaleLowerCase().includes(
              this.filter?.trim().toLowerCase()
            );
          })
        }
      }
    }
  }

}
