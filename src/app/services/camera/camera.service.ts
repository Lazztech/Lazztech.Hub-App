import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async takePicture() {
    const image = await Camera.getPhoto({
      width: 500,
      height: 500,
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    return image.dataUrl;
  }

  async selectPicture() {
    const image = await Camera.getPhoto({
      width: 500,
      height: 500,
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    return image.dataUrl;
  }
}
