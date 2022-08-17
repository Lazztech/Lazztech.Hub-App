import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HubService } from 'src/app/services/hub/hub.service';
import { NGXLogger } from 'ngx-logger';
import { UsersPeopleQuery } from 'src/generated/graphql';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import _ from 'lodash';
import { ApolloQueryResult } from '@apollo/client/core';

export type AlphabetMapOfUsers = {
  [letter: string]: UsersPeopleQuery['usersPeople'];
};

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit, OnDestroy {

  persons: Observable<UsersPeopleQuery['usersPeople']>;
  personsResult: ApolloQueryResult<UsersPeopleQuery>;
  alphabetizedPersons: AlphabetMapOfUsers;
  subscriptions: Subscription[] = [];

  public get loading() : boolean {
    return [
      this.personsResult
    ].some(x => x?.loading);
  }

  constructor(
    public navCtrl: NavController,
    public hubService: HubService,
    private logger: NGXLogger,
    private readonly communcationService: CommunicationService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.hubService.watchUsersPeople().valueChanges.subscribe(result => {
        this.personsResult = result;
        this.alphabetizedPersons = this.alphabetizePersons(result?.data?.usersPeople);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
  }

  alphabetizePersons(persons: UsersPeopleQuery['usersPeople']): AlphabetMapOfUsers {
    console.log('before: ', persons);
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let alphabetArray = alphabet.split('');
    const alphabetizedPersons = [...persons]?.sort((a, b) => (
      a?.lastName.toLowerCase().localeCompare(b?.lastName.toLowerCase())
    ));
    const alphabetMap = <AlphabetMapOfUsers>{};
    alphabetArray.forEach(letter => {
      const startsWithLetter = alphabetizedPersons.filter(person => person?.lastName?.toLowerCase()?.startsWith(letter));
      alphabetMap[letter] = startsWithLetter;
    });
    console.log('after: ', alphabetMap);
    return alphabetMap;
  }

  async doRefresh(event) {
    this.logger.log('Begin async operation');
    // this.loading = true;
    this.persons = this.hubService.watchUsersPeople('network-only').valueChanges.pipe(map(x => x.data && x.data.usersPeople));
    event.target.complete();
    // this.loading = false;
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

  async filterPeople(ev: any) {
    this.persons = this.hubService.watchUsersPeople('cache-only').valueChanges.pipe(map(x => x.data && x.data.usersPeople));
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.persons = this.persons.pipe(
        map(x => x.filter(y => {
          const name = y.firstName.trim().toLowerCase() + y.lastName.trim().toLowerCase();
          return name.includes(val.trim().toLowerCase());
        }))
      );
    }
  }

}
