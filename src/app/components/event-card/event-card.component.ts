import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Event, JoinUserEvent, RsvpGQL } from 'src/graphql/graphql';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {

  @Input() event: Event;
  @Input() userEvent: JoinUserEvent;
  @Input() includeMap?: boolean = false;
  @Input() showRsvp?: boolean = false;

  constructor(
    private readonly navCtrl: NavController,
    private readonly rsvpService: RsvpGQL,
  ) { }

  ngOnInit() {}

  goToEventPage() {
    this.navCtrl.navigateForward('event/' + this.event?.id || this.userEvent?.eventId);
  }

  goToCreateEventPage() {
    this.navCtrl.navigateForward('create-event');
  }

  async segmentChanged(ev: any) {
    console.log('Segment changed', ev?.detail?.value);
    await this.rsvpService.mutate({
      eventId: this.event?.id || this.userEvent?.eventId,
      rsvp: ev?.detail?.value
    }).toPromise();
  }

}
