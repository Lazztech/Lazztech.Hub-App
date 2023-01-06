import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit, OnDestroy {

  initialScreenBrightness: number;
  showCode: boolean = true;
  qrForegroundColor = this.themeService.isDark() ? '#ffffff' : '#000000';
  title: string;
  subtitle: string;
  image: string;
  data: string;

  constructor(
    private readonly themeService: ThemeService,
    private readonly router: Router,
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.title = state?.title;
    this.subtitle = state?.subtitle;
    this.image = state?.image;
    this.data = state?.data;
   }

  async ngOnInit() {
    this.initialScreenBrightness = (await ScreenBrightness.getBrightness()).brightness;
    this.openCode();
  }

  async ngOnDestroy() {
    await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness });
    await this.closeScanner();
  }

  async segmentChanged(event) {
    console.log(event)
    const value = event?.detail?.value;
    console.log(value)
    switch (event?.detail?.value) {
      case 'show-code':
        await this.openCode()
        await this.closeScanner();
        break;
      case 'scan-code':
        await this.closeCode();
        await this.openScanner();
        break;
      default:
        break;
    }
  }

  async openCode() {
    this.showCode = true;
    await ScreenBrightness.setBrightness({ brightness: 1 });
  }

  async closeCode() {
    this.showCode = false;
    await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness });
  }

  async toggleTorch() {
    await BarcodeScanner.toggleTorch();
  }

  async openScanner() {
    // Check camera permission
    // This is just a simple example, check out the better checks below
    await BarcodeScanner.checkPermission({ force: true });

    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();
    document.querySelector('body').classList.add('scanner-active');

    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      alert(result.content);
      console.log(result.content); // log the raw scanned content
    }
  }

  async closeScanner() {
    await BarcodeScanner.showBackground();
    document.querySelector('body').classList.remove('scanner-active');
  }

}
