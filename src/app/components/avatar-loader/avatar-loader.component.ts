import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { IonImg } from '@ionic/angular';

@Component({
  selector: 'app-avatar-loader',
  templateUrl: './avatar-loader.component.html',
  styleUrls: ['./avatar-loader.component.css']
})
export class AvatarLoaderComponent implements AfterViewInit {

  viewImage = false;

  @Input() url: string;
  @ViewChild('image', { static: false }) imageRef: IonImg;

  ngAfterViewInit() {
    this.imageRef.src = this.url;
  }
  loadImage() {
    this.viewImage = true;
  }
  errorLoad() {
    this.imageRef.src = '<your_default_img>';
  }

}
