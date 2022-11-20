import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { JoinUserEvent, RsvpGQL } from 'src/graphql/graphql';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent {

  @Input() userEvent: JoinUserEvent;
  @Input() includeMap?: boolean = false;
  @Input() showRsvp?: boolean = false;

  constructor(
    private readonly navCtrl: NavController,
    private readonly rsvpService: RsvpGQL,
  ) { }

  goToEventPage() {
    this.navCtrl.navigateForward('event/' + this.userEvent?.event?.id);
  }

  goToCreateEventPage() {
    this.navCtrl.navigateForward('create-event');
  }

  async segmentChanged(ev: any) {
    console.log('Segment changed', ev?.detail?.value);
    await this.rsvpService.mutate({
      eventId: this.userEvent?.event?.id,
      rsvp: ev?.detail?.value
    }).toPromise();
  }

}
