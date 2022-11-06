import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { Capacitor } from '@capacitor/core';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  @ViewChild('slides') slides: IonSlides;
  isEnd = false

  platform = Capacitor.getPlatform();

  constructor(
    private storage: Storage,
    private router: Router,
    private nativeSettings: OpenNativeSettings
  ) { }

  ngOnInit() { }

  slideChanged() {
    let me = this;
    me.slides.isEnd().then((istrue) => {
      this.isEnd = istrue;
    });
  }

  async finish() {
    if (this.platform === 'android') {
      alert('Lazztech Hub collects location data to enable automatic check in and out of your community Hubs, even when the app is closed or not in use.');
    }
    await this.storage.set('tutorialCompleted', true);
    this.router.navigateByUrl('/tabs');
  }

  async openAppSettings() {
    this.nativeSettings
      .open('application_details')
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

}
