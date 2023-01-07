import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { Browser } from '@capacitor/browser';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { FileOpener } from '@capacitor-community/file-opener';
import { isPlatform } from '@ionic/angular';

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
    await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness }).catch(x => undefined);
    await this.generatePdf('myQr');
    await ScreenBrightness.setBrightness({ brightness: 1 }).catch(x => undefined);
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
      let pdf = new jspdf('portrait', 'pt', 'a4'); //Generates PDF in landscape mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, canvas.width * 0.25, canvas.height * 0.25);
      let blob = pdf.output('blob');
      console.log('here: ', blob);
      const url = await this.savePdf(blob);
      if (isPlatform('hybrid')) {
        await FileOpener.open({
          filePath: url,
        });
      } else {
        await Browser.open({
          url: URL.createObjectURL(blob),
        });
      }

      this.loading = false;
    } catch (error) {
      this.handleError(error);
    }
  }

  async savePdf(blob: Blob) {
    console.log('in savePdf')
    const base64 = await this.blobToBase64(blob).catch(x => console.log(x)) as string;
    console.log(base64);
    const result = await Filesystem.writeFile({
      path: 'qr.pdf',
      data: base64,
      directory: Directory.Documents,
    });
    console.log(result.uri)
    return result.uri;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    console.log('here: ', blob);
    return new Promise((resolve, reject) => {
      console.log('here: ', blob)
      const reader = this.getFileReader();
      reader.onerror = reject;
      reader.onabort = reject;
      reader.onload = () => {
        console.log(reader)
        resolve(reader.result as string)
      };
      reader.readAsDataURL(blob);
      console.log('here: ', reader, blob);
    })
  }

  // 🤦‍♂️ https://github.com/ionic-team/capacitor/issues/1564#issuecomment-538200971
  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || fileReader;
  }

}
