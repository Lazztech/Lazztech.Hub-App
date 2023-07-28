import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DiscoverPage } from './discover.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MomentModule } from 'ngx-moment';
import { DiscoverPageRoutingModule } from './discover-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    MomentModule,
  ],
  declarations: [DiscoverPage]
})
export class DiscoverPageModule {}
