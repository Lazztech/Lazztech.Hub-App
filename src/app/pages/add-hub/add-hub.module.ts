import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddHubPage } from './add-hub.page';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: AddHubPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule
  ],
  declarations: [AddHubPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddHubPageModule {}
