import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekDay'
})
export class WeekDayPipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): string {
    if (!value) {
      return '';
    }
    let day: number;
    if (value) {
      day = value.getDay();
    }
    switch (day) {
      case (0): { return 'Կիրակի'; }
      case (1): { return 'Երկուշաբթի'; }
      case (2): { return 'Երեքշաբթի'; }
      case (3): { return 'Չորեքշաբթի'; }
      case (4): { return 'Հինգշաբթի'; }
      case (5): { return 'Ուրբաթ'; }
      case (6): { return 'Շաբաթ'; }
    }
  }

}
