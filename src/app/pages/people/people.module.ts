import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PeoplePage } from './people.page';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MomentModule } from 'ngx-moment';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: PeoplePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    PipesModule,
    MomentModule,
    ComponentsModule,
  ],
  declarations: [PeoplePage]
})
export class PeoplePageModule {}
