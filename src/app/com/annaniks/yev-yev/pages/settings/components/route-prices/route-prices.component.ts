import { Component, ElementRef, HostListener, Input } from "@angular/core";
import { SubrouteDetails } from "../../../../core/models/orders-by-hours";
import { Subject } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { SettingsService } from "../../setting.service";
import { Messages } from "../../../../core/models/mesages";
import { map, takeUntil, tap } from "rxjs/operators";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { IRoutePrice } from "../../../../core/models/route-price";
import { RouteParamsDto } from "../../dto/route-prices.dto";
import { DatePipe } from "@angular/common";
import { WEEK_DAYS } from "../../../../core/utilities/week-days";


@Component({
    selector: 'app-route-prices',
    templateUrl: './route-prices.component.html',
    styleUrls: ['./route-prices.component.scss']
})
export class RoutePricesComponent {
    daysOfWeek = WEEK_DAYS;
    pageIndex = 1;
    pageSize = 10;
    total: number;
    subRoutes: SubrouteDetails[] = [];
    isVisible = false;
    unsubscribe$ = new Subject();
    validateForm: FormGroup;
    isEditing = false;
    editIndex: number;
    activeSubRoute: number;
    activeRoutePriceId: number;
    @HostListener('document:keydown.enter', ['$event'])
    handleEnterKey(event: KeyboardEvent): void {
        event.preventDefault();
    }

    constructor(private _settingsService: SettingsService,
        private datePipe: DatePipe,
        private nzMessages: NzMessageService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this.getAllSubRoutes();
        this._initForm();
    }
    getAllSubRoutes() {
        this._settingsService.getRouteSubList(null, this.pageIndex).pipe(map((data: ServerResponce<SubrouteDetails[]>) => {
            this.total = data.count;
            this.subRoutes = data.results;
        })).subscribe();
    }
    getTimesAndPrices(dayIndex: number): FormArray {
        return (this.validateForm.get('days') as FormArray).at(dayIndex).get('timesAndPrices') as FormArray;
    }
    addTimePrice(dayIndex: number): void {
        const timesAndPricesArray = this.getTimesAndPrices(dayIndex);
        timesAndPricesArray.push(
            this._fb.group({
                time: [null, Validators.required],
                price: [null, [Validators.required]],
                id: [null]
            })
        );
    }
    preventEnter(evt) {
        evt.preventDefault();
    }

    removeTimePrice(dayIndex: number, timePriceIndex: number): void {
        const timesAndPricesArray = this.getTimesAndPrices(dayIndex);
        const id = timesAndPricesArray.value[timePriceIndex]?.id;
        timesAndPricesArray.removeAt(timePriceIndex);
        if (id)
            this._settingsService.deletePrice(id).pipe(takeUntil(this.unsubscribe$)).subscribe();
    }
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getAllSubRoutes();
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            days: this._fb.array([])
        });
        this.initDays();
    }
    private initDays() {
        const days = this.validateForm.get('days') as FormArray;
        WEEK_DAYS.forEach(({ value, name }) => {
            days.push(
                this._fb.group({
                    day: [value, Validators.required],
                    name: [name],
                    timesAndPrices: this._fb.array([])
                }))
        })
    }
    onEditPriceAndTimes(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.showModal();
        this.activeSubRoute = this.subRoutes[index].id;
        this.getRoutePricesBySubRouteId();
    }
    private getRoutePricesBySubRouteId() {
        this._settingsService.getRoutePrices(this.activeSubRoute).pipe(
            takeUntil(this.unsubscribe$),
            tap((data) => {
                const routePrices = data || null;
                // this.activeRoutePriceId = routePrices?.id;
                this.setFormValue(routePrices);
            })
        ).subscribe();
    }
    saveTimePrice(dayIndex: number, timePriceIndex: number) {
        const dayForm = this.getTimesAndPrices(dayIndex).controls[timePriceIndex];
        if (dayForm.invalid) {
            return;
        }
        const routePriceDto = new RouteParamsDto(dayForm.value, dayIndex, this.activeSubRoute, this.datePipe);

        this._settingsService.updateRoutePrices(routePriceDto).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            dayForm.get('id').setValue('1000')
        })
    }
    private setFormValue(routePrices) {
        if (!routePrices) {
            return;
        }
        Object.keys(routePrices).forEach((key) => {
            const weekDay = this.getTimesAndPrices(+key);
            const value = routePrices[key];
            value.forEach(({ price, time, id }) => {
                weekDay.push(this._fb.group({ time: this.getHourAndTime(time), price, id }));
            })
        })
    }
    private getHourAndTime(time: string) {
        if (time) {
            let [hours, minutes] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date
        } else {
            return null
        }
    }

    public showModal(): void {
        this.isVisible = true;
        this._initForm();
    }


    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.editIndex = null;
        this.activeRoutePriceId = null;
        this.activeSubRoute = null;
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}