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
    if (response.status == 200) {
      let blob = await response.blob();
      // response doesn't have content type so we're setting an arbitrary image content type
      // so it can be uploaded successfully
      blob = blob.slice(0, blob.size, "image/jpeg");
      return URL.createObjectURL(blob); 
    }
  }

  async getBlobFromObjectUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (response.status == 200) {
      return response.blob();
    }
  }
}
