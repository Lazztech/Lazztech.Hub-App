import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunicationService } from 'src/app/services/communication.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { UsersPeopleGQL, UsersPeopleQuery } from 'src/generated/graphql';

export type AlphabetMapOfUsers = {
  [letter: string]: UsersPeopleQuery['usersPeople'];
};

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit, OnDestroy {

  personsResult: ApolloQueryResult<UsersPeopleQuery>;
  filteredPersons: ApolloQueryResult<UsersPeopleQuery>;
  alphabetizedPersons: AlphabetMapOfUsers;
  subscriptions: Subscription[] = [];
  filter: string = '';

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
    private readonly usersPeopleGQLService: UsersPeopleGQL,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.usersPeopleGQLService.watch().valueChanges.subscribe(result => {
        this.personsResult = result;
        this.alphabetizedPersons = this.alphabetizePersons(result?.data?.usersPeople);
        this.filteredPersons
      })
    );
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

  async filterPeople(ev: any) {
    this.filter = ev?.target?.value;
    if (this.filter && this.filter?.trim() !== '') {
      this.filteredPersons = {
        ...this.personsResult,
        data: {
          usersPeople: this.personsResult?.data?.usersPeople?.filter(usersPerson => {
            const name = usersPerson.firstName.trim().toLowerCase() + usersPerson.lastName.trim().toLowerCase();
            return name.includes(this.filter?.trim().toLowerCase());
          }) 
        }
      }
    }
  }

}
