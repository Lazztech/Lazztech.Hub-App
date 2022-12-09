import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagDirective } from './feature-flag.directive';
import { AutofillDirective } from './autofill.directive';

@NgModule({
  declarations: [FeatureFlagDirective, AutofillDirective],
  imports: [
    CommonModule
  ],
  exports: [FeatureFlagDirective]
})
export class DirectivesModule { }
