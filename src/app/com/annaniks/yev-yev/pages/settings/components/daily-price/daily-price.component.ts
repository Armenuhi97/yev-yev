import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-daily-price',
    templateUrl: 'daily-price.component.html',
    styleUrls: ['daily-price.component.scss']
})
export class DailyPriceComponent{
    validateForm: FormGroup;
    dailyPriceTable: any[] = []
    isVisible: boolean = false;
    editIndex: number = null;
    isEditing: boolean = false;

    
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

    onPriseSave(){
        console.log('test')
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


    
    public dataRoutsRes = [
        {
            id:1,
            day: 1,
            time: '11:20',
            price: 1200
        }
    ]
    
    public dataDaysRes = [
        {
            id:1,
            day: 1,
            time: '11:20',
            price: 1200
        },
        {
            id:1,
            day: 1,
            time: '11:20',
            price: 1200
        },
        {
            id:1,
            day: 1,
            time: '11:20',
            price: 1200
        },
        {
            id:1,
            day: 1,
            time: '11:20',
            price: 1200
        }
    ]
}