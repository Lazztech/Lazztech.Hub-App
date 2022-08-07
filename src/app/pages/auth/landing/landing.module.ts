import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LandingPage } from './landing.page';
import { RegisterPage } from '../register/register.page';
import { PasswordResetPage } from '../password-reset/password-reset.page';
import { ResetPinPage } from '../reset-pin/reset-pin.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        PipesModule
    ],
    declarations: [LandingPage, RegisterPage, PasswordResetPage, ResetPinPage]
})
export class LandingPageModule {}
