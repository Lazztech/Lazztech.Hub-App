import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async takePicture(): Promise<Photo> {
    return Camera.getPhoto({
      width: 500,
      height: 500,
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
  }

  async selectPicture(): Promise<Photo> {
    return Camera.getPhoto({
      width: 500,
      height: 500,
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
  }
}
