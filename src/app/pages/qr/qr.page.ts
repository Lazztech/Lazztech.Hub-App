import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { FileOpener } from '@capacitor-community/file-opener';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { Browser } from '@capacitor/browser';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { isPlatform, NavController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import jsQR from 'jsqr';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { InvitesByHubDocument, InvitesByHubQueryVariables, InviteUserToEventGQL, InviteUserToHubGQL } from 'src/graphql/graphql';

export interface InviteContext { 
  type: 'hub' | 'event',
  id: any,
}

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
  shareableLink: string;
  initialMode: 'show-code' | 'scan-code' = 'show-code';
  inviteContext: InviteContext;
  isHybrid: boolean = isPlatform('hybrid');

  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;

  constructor(
    private readonly themeService: ThemeService,
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly emailComposer: EmailComposer,
    private readonly inviteUserToEventService: InviteUserToEventGQL,
    private readonly inviteUserToHubGQLService: InviteUserToHubGQL,
    private readonly navCtrl: NavController,
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.title = state?.title;
    this.subtitle = state?.subtitle;
    this.image = state?.image;
    this.data = state?.data;
    this.shareableLink = state?.shareableLink;
    this.inviteContext = state?.inviteContext;
    if (state?.initialMode) {
      this.initialMode = state?.initialMode;
    }
    this.showCode = this.initialMode == 'show-code';
   }

  async ngOnInit() {
    if (this.isHybrid) {
      this.initialScreenBrightness = (await ScreenBrightness.getBrightness()).brightness;
    }
  }

  async ionViewDidEnter() {
    switch (this.initialMode) {
      case 'show-code':
        console.log('show-code');
        await this.openCode()
        break;
      case 'scan-code':
        console.log('scan-code');
        this.isHybrid ? await this.openScanner() : await this.startPwaScan();
        break;
      default:
        break;
    }
  }

  async ionViewWillLeave() {
    if (this.isHybrid) {
      await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness });
      await this.closeScanner();
    } else {
      this.stopPwaScan();
    }
  }

  async ngOnDestroy() {
    if (this.isHybrid) {
      await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness });
      await this.closeScanner();
    } else {
      this.stopPwaScan();
    }
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
        this.isHybrid ? await this.closeScanner() : this.stopPwaScan();
        break;
      case 'scan-code':
        await this.closeCode();
        this.isHybrid ? await this.openScanner() : await this.startPwaScan();
        break;
      default:
        break;
    }
  }

  async openCode() {
    this.showCode = true;
    await ScreenBrightness.setBrightness({ brightness: 1 }).catch(x => undefined);
  }

  async closeCode() {
    this.showCode = false;
    await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness }).catch(x => undefined);
  }

  async toggleTorch() {
    await BarcodeScanner.toggleTorch();
  }

  stopPwaScan() {
    this.scanActive = false;
    const stream = this.videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    
    this.videoElement.srcObject = null;
  }

  async startPwaScan() {
    console.log('here: ', this.showCode, this.isHybrid, this.canvas)
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;

    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
  
    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);
  
    this.loading = true;

    this.videoElement.play();
    requestAnimationFrame(this.pwaScan.bind(this));
  }
  
  async pwaScan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        this.loading = false;
        this.loading = null;
        this.scanActive = true;
      }
  
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;
  
      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
  
      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.handleQrContent(code.data);
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.pwaScan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.pwaScan.bind(this));
    }
  }

  handleFile(files: FileList) {
    const file = files.item(0);
  
    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      });
  
      if (code) {
        this.scanResult = code.data;
        this.handleQrContent(code.data);
      }
    };
    img.src = URL.createObjectURL(file);
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
      this.handleQrContent(result.content)
    }
  }

  async closeScanner() {
    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
  }

  async handleQrContent(content: any) {
    console.log(content); // log the raw scanned content
    try {
      const domain = 'lazz.tech';
      if ((content as string)?.includes(domain)) {
        const appPath = content.split(domain).pop();
        if (appPath) {
          this.router.navigateByUrl(appPath);
        }
      } else if (this.inviteContext?.id && this.inviteContext?.type) {
        if (this.inviteContext.type === 'event') {
          const result = await this.inviteUserToEventService.mutate({
            eventId: this.inviteContext.id,
            inviteesShareableId: content,
          }).toPromise();
          this.navCtrl.back();
          this.alertService.presentToast(`Sucessfully invited ${result.data?.inviteUserToEvent?.user?.firstName}`);
        } else {
          const result = await this.inviteUserToHubGQLService.mutate({
            hubId: this.inviteContext.id,
            inviteesShareableId: content,
          }, {
            refetchQueries: [
              { query: InvitesByHubDocument, variables: { hubId: this.inviteContext.id, includeAccepted: false } as InvitesByHubQueryVariables }
            ]
          }).toPromise();
          this.navCtrl.back();
          await this.alertService.presentToast(`Sucessfully invited ${result.data?.inviteUserToHub?.invitee?.firstName}`);
        }
      } else {
        this.navCtrl.back();
        alert('Go to a Hub or Event page then scan to invite someone.');
      }
    } catch (error) {
      this.navCtrl.back();
      this.handleError(error);
    }

  }

  async print() {
    this.loading = true;
    await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness }).catch(x => undefined);
    await this.generatePdf('myQr');
    await ScreenBrightness.setBrightness({ brightness: 1 }).catch(x => undefined);
    this.loading = false;
  }

  async email() {
    try {
      this.loading = true;
      await ScreenBrightness.setBrightness({ brightness: this.initialScreenBrightness }).catch(x => undefined);
      let data = document.getElementById('myQr');  
      const canvas = await html2canvas(data);
      const contentDataURL = canvas.toDataURL('image/png');
      console.log(contentDataURL);
      await this.emailComposer.open({
        attachments: [`base64:image.png//${contentDataURL.split(',').pop()}`],
      });
      await ScreenBrightness.setBrightness({ brightness: 1 }).catch(x => undefined);
      this.loading = false;
    } catch (error) {
      this.handleError(error);
    }
  }

  async share() {
    await Share.share({
      url: this.shareableLink,
      dialogTitle: 'Shareable Link',
    });
  }

  async generatePdf(divId) {
    try {
      let data = document.getElementById(divId);  
      const canvas = await html2canvas(data);
      const contentDataURL = canvas.toDataURL('image/png')  ;
      let pdf = new jspdf('portrait', 'pt', 'a4'); //Generates PDF in landscape mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, canvas.width * 0.25, canvas.height * 0.25);
      let blob = pdf.output('blob');
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
    } catch (error) {
      this.handleError(error);
    }
  }

  async savePdf(blob: Blob) {
    const base64 = await this.blobToBase64(blob) as string;
    const result = await Filesystem.writeFile({
      path: 'qr.pdf',
      data: base64,
      directory: Directory.Documents,
    });
    return result.uri;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = this.getFileReader();
      reader.onerror = reject;
      reader.onabort = reject;
      reader.onload = () => {
        resolve(reader.result as string)
      };
      reader.readAsDataURL(blob);
    })
  }

  // 🤦‍♂️ https://github.com/ionic-team/capacitor/issues/1564#issuecomment-538200971
  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || fileReader;
  }

}
