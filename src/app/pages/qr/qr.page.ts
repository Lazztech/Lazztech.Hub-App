import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit, OnDestroy {

  initialScreenBrightness: number;

  constructor() { }

  async ngOnInit() {
    this.initialScreenBrightness = (await ScreenBrightness.getBrightness()).brightness;
    await ScreenBrightness.setBrightness({ brightness: 1 });
  }

  async ngOnDestroy() {
    await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness });
  }

}
