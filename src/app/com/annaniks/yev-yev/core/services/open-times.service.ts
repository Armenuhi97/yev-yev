import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })

export class OpenTimesService {
    openTimes = [
        { start: '05:30', end: '06:00', time: '05:30 - 06:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '06:00', end: '06:30', time: '06:00 - 06:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '06:30', end: '07:00', time: '06:30 - 07:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '07:00', end: '07:30', time: '07:00 - 07:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '07:30', end: '08:00', time: '07:30 - 08:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '08:00', end: '08:30', time: '08:00 - 08:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '08:30', end: '09:00', time: '08:30 - 09:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '09:00', end: '09:30', time: '09:00 - 09:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '09:30', end: '10:00', time: '09:30 - 10:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '10:00', end: '10:30', time: '10:00 - 10:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '10:30', end: '11:00', time: '10:30 - 11:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '11:00', end: '11:30', time: '11:00 - 11:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '11:30', end: '12:00', time: '11:30 - 12:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '12:00', end: '12:30', time: '12:00 - 12:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '12:30', end: '13:00', time: '12:30 - 13:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '13:00', end: '13:30', time: '13:00 - 13:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '13:30', end: '14:00', time: '13:30 - 14:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '14:00', end: '14:30', time: '14:00 - 14:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '14:30', end: '15:00', time: '14:30 - 15:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '15:00', end: '15:30', time: '15:00 - 15:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '15:30', end: '16:00', time: '15:30 - 16:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '16:00', end: '16:30', time: '16:00 - 16:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '16:30', end: '17:00', time: '16:30 - 17:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '17:00', end: '17:30', time: '17:00 - 17:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '17:30', end: '18:00', time: '17:30 - 18:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '18:00', end: '18:30', time: '18:00 - 18:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '18:30', end: '19:00', time: '18:30 - 19:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '19:00', end: '19:30', time: '19:00 - 19:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '19:30', end: '20:00', time: '19:30 - 20:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '20:00', end: '20:30', time: '20:00 - 20:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '20:30', end: '21:00', time: '20:30 - 21:00', isActive: true, closeId: 0, isDisabled: false }
    ]
    getOpenTimes() {
        return this.openTimes
    }

}