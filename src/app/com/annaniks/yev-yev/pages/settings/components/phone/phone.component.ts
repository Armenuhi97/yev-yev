import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Messages } from "../../../../core/models/mesages";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { SettingsService } from "../../setting.service";

@Component({
    selector: 'app-phone',
    templateUrl: 'phone.component.html',
    styleUrls: ['phone.component.scss']
})
export class PhoneComponent {
    phoneTable: any[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number;
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    validateForm: FormGroup;
    editIndex: number = null;
    @Input('array')
    set setArray($event) {
        this.phoneTable = $event
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
            name_ru: [null, Validators.required],
            phone_number: [null, Validators.required]
        })
    }
    public getAllPhones() {
        this._settingsService.getAllphone(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<any[]>) => {
            this.total = data.count;
            this.phoneTable = data.results;
        })
    }

    onEditphone(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.getphoneById(this.phoneTable[this.editIndex].id);
        this.showModal()
    }
    public getphoneById(id: number) {
        this._settingsService.getphoneById(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
            this.validateForm.patchValue({
                name_en: data.name_en,
                name_hy: data.name_hy,
                name_ru: data.name_ru,
                phone_number: data.phone_number
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
        this.getAllPhones()
    }
    public onphoneSave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }
        let sendObject = {
            name_en: this.validateForm.get('name_en').value,
            name_ru: this.validateForm.get('name_ru').value,
            name_hy: this.validateForm.get('name_hy').value,
            phone_number: this.validateForm.get('phone_number').value,
        }
        if (this.editIndex == null) {
            this._settingsService.addphone(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
                this.total += 1;
                this.nzPageIndexChange(1)
                // this.phoneTable.push(data);
                this.nzMessages.success(Messages.success)

                this.closeModal();
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        } else {
            this._settingsService.editphone(this.phoneTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
                this.phoneTable[this.editIndex].name_en = data.name_en;
                this.phoneTable[this.editIndex].name_ru = data.name_ru;
                this.phoneTable[this.editIndex].name_hy = data.name_hy;
                this.phoneTable[this.editIndex].phone_number = data.phone_number;

                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.success(Messages.fail)
                })
        }
    }
    onDeletephone(index: number): void {
        this._settingsService
            .deletephone(this.phoneTable[index].id)
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {

                this.phoneTable.splice(index, 1);

                this.phoneTable = [...this.phoneTable];
                if (!this.phoneTable.length && this.pageIndex !== 1) {
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