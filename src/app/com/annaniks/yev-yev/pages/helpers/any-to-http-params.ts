import { HttpParams } from '@angular/common/http';

export function anyToHttpParams(obj?: any) {
    let params = new HttpParams();
    if (!obj) {
        return;
    }
    for (const key in obj) {
        params = params.set(key, obj[key] as string);
    }
    return params;
}
