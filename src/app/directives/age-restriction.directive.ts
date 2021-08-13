import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export function AgeRestrictionValidator(ageRestrictionInYears: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthdate = moment(control.value).format('YYYY-MM-DD');
    const ageDifferenceInYears = moment().diff(moment(birthdate, 'YYYY-MM-DD'), 'years');

    console.log(ageDifferenceInYears);
    return ageDifferenceInYears >= ageRestrictionInYears ? null : { forbiddenAge: { value: control.value } };
  };
}
