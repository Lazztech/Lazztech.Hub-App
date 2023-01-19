import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminEventPageRoutingModule } from './admin-event-routing.module';

import { AdminEventPage } from './admin-event.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { MomentModule } from 'ngx-moment';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminEventPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    MomentModule,
    PipesModule,
  ],
  declarations: [AdminEventPage]
})
export class AdminEventPageModule {}
