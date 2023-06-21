import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadGalleryPage } from './upload-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: UploadGalleryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadGalleryPageRoutingModule {}
