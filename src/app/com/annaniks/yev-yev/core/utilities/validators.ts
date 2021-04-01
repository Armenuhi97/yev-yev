import {FormGroup} from '@angular/forms';

// tslint:disable-next-line:typedef
export function dateLessThan(from: string, to: string) {
  return (group: FormGroup): {[key: string]: any} => {
    const f = group.controls[from];
    const t = group.controls[to];
    if (f.valid && t.valid && f.value > t.value) {
      return {
        wrongDate: true
      };
    }
    return {};
  };
}

import { AbstractControl } from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('repeatPassword').value; // to get value in input tag
        if (password != confirmPassword) {
            AC.get('repeatPassword').setErrors({ MatchPassword: true })
        } else {
            return null
        }
    }
}