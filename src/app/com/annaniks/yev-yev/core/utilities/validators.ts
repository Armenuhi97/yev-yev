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
