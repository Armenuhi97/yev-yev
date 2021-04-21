import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Messages } from "../../../../core/models/mesages";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { OtherRoutesTime } from "../../../../core/models/ther-routes-time";
import { SettingsService } from "../../setting.service";

@Component({
    selector: 'app-other-routes-time',
    templateUrl: 'other-routes-time.component.html',
    styleUrls: ['other-routes-time.component.scss'],
    providers: [DatePipe]
})
export class OtherRoutesTimes {
    timesList: OtherRoutesTime[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number = 1;
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    validateForm: FormGroup;
    editIndex: number = null;
    @Input('array')
    set setArray($event: OtherRoutesTime[]) {
        this.timesList = $event
    }

    constructor(private _settingsService: SettingsService,
        private _datePipe: DatePipe,
        private nzMessages: NzMessageService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._initForm()
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            work_day_start: [null, Validators.required],
            work_day_end: [null, Validators.required],

        })
    }
    public getAllcities() {
        this._settingsService.getOtherRoutesTimeList().pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<OtherRoutesTime[]>) => {
            this.timesList = data.results;
        })
    }

    onEditTimes(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.validateForm.patchValue({
            work_day_start: this.timesList[index] && this.timesList[index].work_day_start ? this.getHourAndTime(this.timesList[index].work_day_start) : null,
            work_day_end: this.timesList[index] && this.timesList[index].work_day_end ? this.getHourAndTime(this.timesList[index].work_day_end) : null,

        })
        this.showModal()
    }
    private _addMinutesInRoute(hour) {
        return hour ? this._datePipe.transform(hour, 'HH') + ':00' : null

    }
    public showModal(): void {
        this.isVisible = true;
    }
    handleCancel(): void {
        this.isVisible = false;
        this.isEditing = false;
        this.validateForm.reset();
        this.editIndex = null
    }
    getHourAndTime(time) {
        if (time) {
            let hourLastIndex = time.indexOf(':')
            let hour = time.substr(0, hourLastIndex);
            let date = new Date();
            date.setHours(+hour);
            return date
        } else {
            return null
        }

    }
    public onTimesSave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }
        let sendObject: OtherRoutesTime = {
            work_day_start: this._addMinutesInRoute(this.validateForm.value.work_day_start),
            work_day_end: this._addMinutesInRoute(this.validateForm.value.work_day_end)
        }
        if (this.editIndex == null) {
            this._settingsService.addOtherRoutesTimeList(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: OtherRoutesTime) => {
                this.timesList.push(data)
                this.closeModal();
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        } else {
            this._settingsService.editOtherRoutesTimeList(this.timesList[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: OtherRoutesTime) => {
                this.timesList[this.editIndex].work_day_start = data.work_day_start;
                this.timesList[this.editIndex].work_day_end = data.work_day_end;
                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.success(Messages.fail)
                })
        }
    }

    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.editIndex = null
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}