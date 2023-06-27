import { Component, Input, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Action } from 'rxjs/internal/scheduler/Action';
import { File, JoinHubFile } from 'src/graphql/graphql';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Zoom } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Zoom]); 

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage {

  @ViewChild('swiper') swiper: SwiperComponent

  @Input() img: string;
  @Input() file: File;

  config: SwiperOptions = {
    zoom:  true,
  };
  constructor(
    private modalCtl: ModalController,
    private actionSheetController: ActionSheetController,
  ) {}

  close() {
    this.modalCtl.dismiss();
  }

  zoom(zoomIn: boolean) {
    const zoom = this.swiper.swiperRef.zoom;
    zoomIn ? zoom.in() : zoom.out(); 
  }

  async presentActionSheet() {
    if (this.file) {
      const buttons = [];   
        buttons.push(
        {
          text: 'Report as Inappropriate',
          role: 'destructive',
          handler: () => {
            if (confirm('Report as Inappropriate? This may result in the removal of data & the offending content creator.')) {
              // this.loading = true;
              // this.hubService.reportAsInappropriate(this.id).then(() => {
                // this.loading = false;
                // this.navCtrl.back();
              // });
            }
          }
        }
      );

      const actionSheet = await this.actionSheetController.create({
        header: 'Upload Options',
        buttons: [
          ...buttons,
          {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // this.logger.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
    }
  }

}
 