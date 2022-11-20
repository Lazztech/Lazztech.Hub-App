import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  @Input()
  user: any;

  @Input()
  showLastOnline = true;

  constructor() { }

}
