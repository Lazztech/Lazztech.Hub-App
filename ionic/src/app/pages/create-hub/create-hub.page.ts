import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-hub',
  templateUrl: './create-hub.page.html',
  styleUrls: ['./create-hub.page.scss'],
})
export class CreateHubPage implements OnInit {

  photo: any;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
  }

}
