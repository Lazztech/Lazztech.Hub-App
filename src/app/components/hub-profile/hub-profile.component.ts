import { Component, Input } from '@angular/core';
import { Hub } from 'src/graphql/graphql';

@Component({
  selector: 'app-hub-profile',
  templateUrl: './hub-profile.component.html',
  styleUrls: ['./hub-profile.component.scss'],
})
export class HubProfileComponent {

  @Input()
  hub: Hub;

  constructor() { }

}
