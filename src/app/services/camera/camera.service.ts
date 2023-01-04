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
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
  }

  async selectPicture(): Promise<Photo> {
    return Camera.getPhoto({
      width: 500,
      height: 500,
      quality: 100,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
  }

  async getImageBlob(photo: Photo): Promise<Blob> {
    // Fetch the photo, read as a blob
    const response = await fetch(photo?.webPath);
    return response.blob();
  }

  async getLocalObjectUrl(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], '', { type: 'image/webp' });
    return URL.createObjectURL(file);
  }

  async getBlobFromObjectUrl(url: string): Promise<Blob> {
    return fetch(url).then(r => r.blob());
  }
}
