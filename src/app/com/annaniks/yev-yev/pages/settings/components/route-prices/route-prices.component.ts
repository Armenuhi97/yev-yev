import { Component, Input } from "@angular/core";
import { SubrouteDetails } from "../../../../core/models/orders-by-hours";
import { Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { SettingsService } from "../../setting.service";
import { Messages } from "../../../../core/models/mesages";
import { map, takeUntil, tap } from "rxjs/operators";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { IRoutePrice } from "../../../../core/models/route-price";
import { RouteParamsDto } from "../../dto/route-prices.dto";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-route-prices',
    templateUrl: './route-prices.component.html',
    styleUrls: ['./route-prices.component.scss']
})
export class RoutePricesComponent {
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
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getAllSubRoutes();
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            sunday_price: [null, Validators.required],
            sunday_time: [null, Validators.required],
            monday_price: [null, Validators.required],
            monday_time: [null, Validators.required],
            tuesday_price: [null, Validators.required],
            tuesday_time: [null, Validators.required],
            wednesday_price: [null, Validators.required],
            wednesday_time: [null, Validators.required],
            thursday_price: [null, Validators.required],
            thursday_time: [null, Validators.required],
            friday_price: [null, Validators.required],
            friday_time: [null, Validators.required],
            saturday_price: [null, Validators.required],
            saturday_time: [null, Validators.required],
            is_active: [false]
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
                const routePrices = data.results?.[0] || null;
                this.activeRoutePriceId = routePrices?.id;
                this.setFormValue(routePrices);
            })
        ).subscribe();
    }
    private setFormValue(routePrices: IRoutePrice) {
        if (!routePrices) {
            return;
        }
        this.validateForm.patchValue({
            sunday_price: routePrices.sunday_price,
            sunday_time: this.getHourAndTime(routePrices.sunday_time),
            monday_price: routePrices.monday_price,
            monday_time: this.getHourAndTime(routePrices.monday_time),
            tuesday_price: routePrices.tuesday_price,
            tuesday_time: this.getHourAndTime(routePrices.tuesday_time),
            wednesday_price: routePrices.wednesday_price,
            wednesday_time: this.getHourAndTime(routePrices.wednesday_time),
            thursday_price: routePrices.thursday_price,
            thursday_time: this.getHourAndTime(routePrices.thursday_time),
            friday_price: routePrices.friday_price,
            friday_time: this.getHourAndTime(routePrices.friday_time),
            saturday_price: routePrices.saturday_price,
            saturday_time: this.getHourAndTime(routePrices.saturday_time),
            is_active: routePrices.is_active
        });
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
    }

    public onSave() {
        console.log(this.validateForm);
        
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.failValidation);
            return;
        }
        const formValue = this.validateForm.value;
        const routePriceDto = new RouteParamsDto(formValue, this.activeSubRoute, this.datePipe);
        this._settingsService.updateRoutePrices(this.activeRoutePriceId, routePriceDto)
            .pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
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