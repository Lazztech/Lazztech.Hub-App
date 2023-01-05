import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QrPageRoutingModule } from './qr-routing.module';
import { QrPage } from './qr.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrPageRoutingModule,
    QRCodeModule,
  ],
  declarations: [QrPage]
})
export class QrPageModule {}
