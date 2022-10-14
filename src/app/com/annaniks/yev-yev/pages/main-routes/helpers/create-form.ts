import { FormGroup, Validators } from '@angular/forms';

export function createForm(fb, extra: string = ''): FormGroup {
    const group = fb.group({
        ['first_name' + extra]: [null],
        ['last_name' + extra]: [null],
        ['phone_number' + extra]: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        ['userComment' + extra]: [null],
        ['startPointAddress' + extra]: [null],
        ['endPointAddress' + extra]: [null],
        ['order_phone_number' + extra]: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        ['orderType' + extra]: [0, Validators.required],
        ['personCount' + extra]: [null, Validators.required],
        ['comment' + extra]: [null],
        ['date' + extra]: [null],
        ['time' + extra]: [null],
        ['isChangeStatus' + extra]: [false],
        ['isFree' + extra]: [false],
        ['isExtra' + extra]: [false],
        ['userId' + extra]: [null],

    });
    if (extra) {
        group.get('date' + extra).setValidators([Validators.required]);
        group.get('time' + extra).setValidators([Validators.required]);
    }
    return group;
}
