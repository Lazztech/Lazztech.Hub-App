import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminEventPage } from './admin-event.page';

const routes: Routes = [
  {
    path: '',
    component: AdminEventPage
  },
  {
    path: ':id',
    component: AdminEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminEventPageRoutingModule {}
