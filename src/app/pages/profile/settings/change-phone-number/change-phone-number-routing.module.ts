import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePhoneNumberPage } from './change-phone-number.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePhoneNumberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePhoneNumberPageRoutingModule {}
