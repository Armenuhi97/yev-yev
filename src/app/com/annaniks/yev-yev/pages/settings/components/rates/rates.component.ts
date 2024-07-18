import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-rates',
    templateUrl: 'rates.component.html',
    styleUrls: ['rates.component.scss']
})
export class RatesComponent {
    validateForm: FormGroup;
    ratesTable: any[] = []
    isVisible: boolean = false;
    editIndex: number = null;
    isEditing: boolean = false;



    // @Input('array')
    // set setArray($event) {
    //     this.ratesTable = $event
    // }

    @Input() array: any[];

    @Input() total: number;

    constructor(
        private nzMessages: NzMessageService,
        private _fb: FormBuilder
    ) { }

    ngOnInit() {
        this._initForm
    }

    private _initForm() {
        this.validateForm = this._fb.group({
            price: [null, Validators.required],
        })
    }

    onEditRates(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        // this.getphoneById(this.phoneTable[this.editIndex].id);
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

    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.editIndex = null
    }

    public dataRes = [
        {
            id: 1,
            sitCount: 4,
            price: 1000,
        },
        {
            id: 2,
            sitCount: 6,
            price: 1200,
        },
        {
            id: 3,
            sitCount: 7,
            price: 1600,
        },
        {
            id: 4,
            sitCount: 8,
            price: 2000,
        }
    ]
}