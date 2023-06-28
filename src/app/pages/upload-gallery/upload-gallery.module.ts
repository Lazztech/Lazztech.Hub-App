import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UploadGalleryPage } from './upload-gallery.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MomentModule } from 'ngx-moment';
import { UploadGalleryPageRoutingModule } from './upload-gallery-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadGalleryPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    MomentModule,
  ],
  declarations: [UploadGalleryPage]
})
export class UploadGalleryPageModule {}
