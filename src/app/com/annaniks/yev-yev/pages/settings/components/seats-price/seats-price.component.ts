import { Component, Input } from "@angular/core";
import { SettingsService } from "../../setting.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ISeatsPrice, ISeatsPriseFormatted } from "../../../../core/models/seats-price";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Messages } from "../../../../core/models/mesages";

@Component({
    selector: 'app-seats-price',
    templateUrl: './seats-price.component.html',
    styleUrls: ['./seats-price.component.scss']
})
export class SeatsPriceComponent {
    @Input() seatsPriceList: ISeatsPriseFormatted[] = [];
    isVisible = false;
    unsubscribe$ = new Subject();
    pageIndex = 1;
    validateForm: FormGroup;
    isEditing = false;
    editIndex: number;
    constructor(private _settingsService: SettingsService,
        private nzMessages: NzMessageService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._initForm()
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            price: [null, Validators.required]
        })
    }

    onEditPrice(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.validateForm.patchValue({
            price: this.seatsPriceList[this.editIndex].price
        })
        this.showModal()
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

    public onTimesSave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }
        const { id, key } = this.seatsPriceList[this.editIndex];
        const price = this.validateForm.get('price').value;
        this._settingsService.updateSeatsPrice(id, { [key]: price })
            .pipe(takeUntil(this.unsubscribe$)).subscribe((data: ISeatsPrice) => {
                this.seatsPriceList[this.editIndex].price = data[key];
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
        this.editIndex = null
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}