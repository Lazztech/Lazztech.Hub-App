import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HubService } from 'src/app/services/hub/hub.service';
import { UsersPeopleQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  persons: Observable<UsersPeopleQuery['usersPeople']>;

  constructor(
    private hubService: HubService,
  ) { }

  ngOnInit() {
    this.persons = this.hubService.watchUsersPeople().valueChanges.pipe(map(x => x.data && x.data.usersPeople));
  }

}
