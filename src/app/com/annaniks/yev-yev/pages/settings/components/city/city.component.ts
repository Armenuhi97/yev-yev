
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CityItem } from "../../../../core/models/city.model";
import { Messages } from "../../../../core/models/mesages";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { SettingsService } from "../../setting.service";

@Component({
    selector: 'app-city',
    templateUrl: 'city.component.html',
    styleUrls: ['city.component.scss']
})
export class CityComponent {
    cityTable: CityItem[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number;
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    validateForm: FormGroup;
    editIndex: number = null;
    @Input('array')
    set setArray($event: CityItem[]) {
        this.cityTable = $event
    }
    @Input('total')
    set setTotal($event: number) {
        this.total = $event
    }
    constructor(private _settingsService: SettingsService,
        private nzMessages: NzMessageService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._initForm()
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            name_en: [null, Validators.required],
            name_hy: [null, Validators.required],
            name_ru: [null, Validators.required]
        })
    }
    public getAllcities() {
        this._settingsService.getAllCities(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<CityItem[]>) => {
            this.total = data.count;
            this.cityTable = data.results;
        })
    }

    onEditcity(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.getcityById(this.cityTable[this.editIndex].id);
        this.showModal()
    }
    public getcityById(id: number) {
        this._settingsService.getCityById(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            this.validateForm.patchValue({
                name_en: data.name_en,
                name_hy: data.name_hy,
                name_ru: data.name_ru
            })
        })
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
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getAllcities()
    }
    public oncitySave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }
        let sendObject: CityItem = {
            name_en: this.validateForm.get('name_en').value,
            name_ru: this.validateForm.get('name_ru').value,
            name_hy: this.validateForm.get('name_hy').value,
        }
        if (this.editIndex == null) {
            this._settingsService.addCity(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: CityItem) => {
                this.total += 1;
                this.cityTable.push(data);
                this.nzMessages.success(Messages.success)

                this.closeModal();
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        } else {
            this._settingsService.editCity(this.cityTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: CityItem) => {
                this.cityTable[this.editIndex].name_en = data.name_en;
                this.cityTable[this.editIndex].name_ru = data.name_ru;
                this.cityTable[this.editIndex].name_hy = data.name_hy;
                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.success(Messages.fail)
                })
        }
    }
    onDeletecity(index: number): void {
        this._settingsService
            .deleteCity(this.cityTable[index].id)
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {

                this.cityTable.splice(index, 1);

                this.cityTable = [...this.cityTable];
                if (!this.cityTable.length && this.pageIndex !== 1) {
                    this.nzPageIndexChange(this.pageIndex - 1)
                }
                this.nzMessages.success(Messages.success)
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                });
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