import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Browser } from '@capacitor/browser';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { reject } from 'lodash-es';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit, OnDestroy {

  loading: boolean = false;
  initialScreenBrightness: number;
  showCode: boolean;
  qrForegroundColor = this.themeService.isDark() ? '#ffffff' : '#000000';
  title: string;
  subtitle: string;
  image: string;
  data: string;
  initialMode: 'show-code' | 'scan-code' = 'show-code';

  constructor(
    private readonly themeService: ThemeService,
    private readonly router: Router,
    private readonly alertService: AlertService,
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.title = state?.title;
    this.subtitle = state?.subtitle;
    this.image = state?.image;
    this.data = state?.data;
    if (state?.initialMode) {
      this.initialMode = state?.initialMode;
    }
    this.showCode = this.initialMode == 'show-code';
   }

  async ngOnInit() {
    this.initialScreenBrightness = (await ScreenBrightness.getBrightness()).brightness;
    switch (this.initialMode) {
      case 'show-code':
        await this.openCode()
        break;
      case 'scan-code':
        await this.openScanner();
        break;
      default:
        break;
    }
  }

  async ngOnDestroy() {
    await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness });
    await this.closeScanner();
  }

  async handleError(err) {
    await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    this.loading = false;
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

  async print() {
    await this.generatePdf('myQr')
  }

  async email() {}

  async share() {
    await Share.share({
      url: this.data,
      dialogTitle: 'Shareable Link',
    });
  }

  async generatePdf(divId) {
    this.loading = true;
    try {
      let data = document.getElementById(divId);  
      console.log(data);
      const canvas = await html2canvas(data);
      const contentDataURL = canvas.toDataURL('image/png')  ;
      console.log(contentDataURL);
      console.log('width: ', canvas.width);
      console.log('height: ', canvas.height);
      let pdf = new jspdf('l', 'pt', 'a4'); //Generates PDF in landscape mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, canvas.width * 0.25, canvas.height * 0.25);
      let blob = pdf.output('blob');
      console.log('here: ', blob);
      // const url = URL.createObjectURL(blob);
    } catch (error) {
      this.handleError(error);
    }
  }

  async savePdf(blob: Blob) {
    console.log('in savePdf')
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onabort = reject;
    reader.onload = async () => {
      console.log(reader)
      const base64 = reader.result as string;
      console.log('here: ', reader, blob);
      console.log(base64);
      const result = await Filesystem.writeFile({
        path: 'qr.pdf',
        data: base64,
        directory: Directory.Data,
      });
      console.log(result.uri)
      await Browser.open({
        url: result.uri,
      });
      this.loading = false;
    };
    reader.readAsDataURL(blob);
  }

}
