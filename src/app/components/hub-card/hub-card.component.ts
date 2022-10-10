import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { LocationService } from 'src/app/services/location/location.service';
import { Observable, Subscription, zip } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { HubService } from 'src/app/services/hub/hub.service';
import { Hub } from 'src/graphql/graphql';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-hub-card',
  templateUrl: './hub-card.component.html',
  styleUrls: ['./hub-card.component.scss'],
})
export class HubCardComponent implements OnInit, OnDestroy, OnChanges {

  @Input() hub: Hub;
  @Input() adminControls = false;
  @Input() showDescription = false;
  @Input() coords: {longitude: number, latitude: number};
  @Input() starred = false;
  @Input() muted = false;
  @Input() isOwner = false;
  @Input() includeMap = false;
  @Input() compact = true;

  atHub = false;
  subscription: Subscription;
  presentCount = 0;
  private distanceInMeters: number;
  private distanceInMiles: number;

  constructor(
    private locationService: LocationService,
    private changeRef: ChangeDetectorRef,
    private hubService: HubService,
    private logger: NGXLogger,
  ) { }

  async ngOnInit() {
    this.presentCount = this.hub.usersConnection?.filter(x => x.isPresent).length;
  }

  ngOnChanges() {
      if (this.hub && this.coords?.latitude && this.coords?.longitude) {
        this.atHub = this.locationService.atHub(this.hub, this.coords);
      }
      if (!this.atHub && this.hub && this.coords) {
        this.distanceInMeters = this.locationService.getDistanceFromHub(this.hub, this.coords);
        this.distanceInMiles = this.locationService.getMilesFromMeters(this.distanceInMeters);
      }
      this.presentCount = this.hub.usersConnection?.filter(x => x.isPresent).length;
      this.changeRef.detectChanges();
  }

  async activeToggle($event) {
    this.logger.log(this.hub.active);
    this.logger.log($event);

    if ($event.detail.checked) {
      await this.hubService.activateHub(this.hub.id);
    } else {
      await this.hubService.deactivateHub(this.hub.id);
    }
  }

  async ngOnDestroy() {
  }

}
