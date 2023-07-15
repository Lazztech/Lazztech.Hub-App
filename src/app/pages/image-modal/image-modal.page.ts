import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { File } from 'src/graphql/graphql';
import SwiperCore, { Pagination, SwiperOptions, Zoom } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Zoom, Pagination]); 

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements AfterViewInit {

  @ViewChild('swiper') swiper: SwiperComponent

  @Input() img: string;
  @Input() startingFileIndex: number;
  @Input() files: Array<File>;

  config: SwiperOptions = {
    zoom:  true,
    pagination: {
      dynamicBullets: true
    },
  };
  constructor(
    private modalCtl: ModalController,
  ) {}

  ngAfterViewInit(): void {
    this.startingFileIndex && this.swiper.swiperRef.slideTo(this.startingFileIndex);
  }

  close() {
    this.modalCtl.dismiss();
  }

  next() {
    this.swiper.swiperRef.slideNext();
  }

  back() {
    this.swiper.swiperRef.slidePrev();
  }

}
 