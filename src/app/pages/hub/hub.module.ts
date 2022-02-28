import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HubPage } from './hub.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MomentModule } from 'ngx-moment';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';

const routes: Routes = [
  {
    path: '',
    component: HubPage
  },
  {
    path: ':id',
    component: HubPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    MomentModule,
    IonicHeaderParallaxModule
  ],
  declarations: [HubPage]
})
export class HubPageModule {}
