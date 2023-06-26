import { Component, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  ) {}

  close() {
    this.modalCtl.dismiss();
  }

  zoom(zoomIn: boolean) {
    const zoom = this.swiper.swiperRef.zoom;
    zoomIn ? zoom.in() : zoom.out(); 
  }

}
 