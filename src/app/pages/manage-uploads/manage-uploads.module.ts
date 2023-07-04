import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ManageUploadsPage } from './manage-uploads.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MomentModule } from 'ngx-moment';
import { ManageUploadsPageRoutingModule } from './manage-uploads-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageUploadsPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    MomentModule,
  ],
  declarations: [ManageUploadsPage]
})
export class ManageUploadsPageModule {}
