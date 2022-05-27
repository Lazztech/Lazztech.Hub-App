import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {

  constructor(
    public navCtrl: NavController,
  ) { }

  ngOnInit() {}

  goToEventPage() {
    this.navCtrl.navigateForward('event');
  }

  goToCreateEventPage() {
    this.navCtrl.navigateForward('create-event');
  }

}