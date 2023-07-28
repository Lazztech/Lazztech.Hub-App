import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { ImageModalPageRoutingModule } from './image-modal-routing.module';
import { ImageModalPage } from './image-modal.page';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageModalPageRoutingModule,
    SwiperModule,
    MomentModule,
  ],
  declarations: [ImageModalPage]
})
export class ImageModalPageModule {}
