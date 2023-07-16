import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageUploadsPage } from './manage-uploads.page';

const routes: Routes = [
  {
    path: '',
    component: ManageUploadsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageUploadsPageRoutingModule {}
