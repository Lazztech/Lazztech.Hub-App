import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location/location.service';
import { EventDocument, JoinUserEvent, RsvpGQL } from 'src/graphql/graphql';
import { NavigationService } from 'src/app/services/navigation.service';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnChanges {

  @Input() userEvent: JoinUserEvent;
  @Input() includeMap?: boolean = false;
  @Input() showRsvp?: boolean = false;
  @Input() compact = true;
  @Output() shouldPromptToAddEventToCalendar = new EventEmitter();
  presentCount = 0;

  constructor(
    private readonly navCtrl: NavController,
    private readonly rsvpService: RsvpGQL,
    public readonly navigationService: NavigationService,
    public locationService: LocationService,
  ) { }

  goToEventPage() {
    this.navCtrl.navigateForward('tabs/event/' + this.userEvent?.event?.id);
  }

  goToCreateEventPage() {
    this.navCtrl.navigateForward('create-event');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const previousRsvp = changes?.userEvent?.previousValue?.rsvp;
    const currentRsvp = changes?.userEvent?.currentValue?.rsvp;
    if (
      previousRsvp !== undefined && currentRsvp !== undefined // neither rsvp should be undefined
      && currentRsvp !== null // rsvp should not be null which is equivalent to initial 'no reply'
      && !previousRsvp && currentRsvp !== 'cantgo' // rsvp should be first affirmative rsvp change
    ) {
      setTimeout(() =>  this.shouldPromptToAddEventToCalendar.emit(), 100);
    }
    this.presentCount = this.userEvent?.event?.usersConnection?.filter(x => x.isPresent)?.length;
  }

  goingCount() {
    return this.userEvent?.event?.usersConnection?.filter(user => user.rsvp === 'going')?.length;
  }

  capacityPercentage() {
    const min = this.userEvent?.event?.minimumCapacity;
    const max = this.userEvent?.event?.maximumCapacity;
    const currentCapacity = this.goingCount();
    return parseFloat(`${(100 * currentCapacity / max)}%`)  / 100;
  }

  hasHitMinimumCapacity() {
    const currentCapacity = this.goingCount();
    const min = this.userEvent?.event?.minimumCapacity;
    return currentCapacity >= min;
  }

  capacityColor() {
    return (this.capacityPercentage() > 1 || !this.hasHitMinimumCapacity()) ? 'danger' : 'success';
  }

  prettyCapacityPercentage() {
    return `${Math.trunc(this.capacityPercentage() * 100)}%`
  }

  async segmentChanged(ev: any) {
    console.log('Segment changed', ev?.detail?.value);
    await this.rsvpService.mutate({
      eventId: this.userEvent?.event?.id,
      rsvp: ev?.detail?.value,
    }, {
      refetchQueries: [
        { query: EventDocument, variables: { id: this.userEvent?.event?.id } },
      ],
      awaitRefetchQueries: true,
    }).toPromise();
  }

  async requestRide() {
      this.navigationService.requestUber(this.locationService.location, this.userEvent?.event, this.userEvent?.event.name);
    }

  async navigate() {
    this.navigationService.navigate(this.locationService.location, this.userEvent?.event)
  }
}
