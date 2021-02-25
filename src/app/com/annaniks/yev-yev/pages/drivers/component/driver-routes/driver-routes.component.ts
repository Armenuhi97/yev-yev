import { Component } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Messages } from "../../../../core/models/mesages";
import { DriverService } from "../../drivers.service";

@Component({
    selector: 'app-driver-routes',
    templateUrl: 'driver-routes.component.html',
    styleUrls: ['driver-routes.component.scss']
})
export class DriverRoutesComponent {
    // driverRouteTable: any[] = []
    // pageSize: number = 10;
    // unsubscribe$ = new Subject();
    // total: number;
    // pageIndex: number = 1;
    // isEditing: boolean = false;
    // isVisible: boolean = false;
    // editIndex: number = null;
    // public currentroute = new FormControl('', [Validators.required])

    // constructor(private _driversService: DriverService,
    //     private nzMessages: NzMessageService,
    //     private _fb: FormBuilder) {
    // }

    // ngOnInit() {
    //     this.getUsers()
    // }
 
    // public getUsers() {
    //     this._driversService.getUsers(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<User[]>) => {
    //         this.total = data.count;
    //         this.driverRouteTable = data.results;
    //     })
    // }

    // onEditsalary(index: number) {
    //     this.isEditing = true;
    //     this.editIndex = index;
    //     this.getsalaryById(this.driverRouteTable[this.editIndex].id);
    //     this.showModal()
    // }
    // public getsalaryById(id: number) {
    //     this._driversService.getUserById(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<User>) => {
    //         if(data.results && data.results[0]) {
    //             let item = data.results[0]
    //             this.validateForm.patchValue({
    //                 first_name: item.user.first_name,
    //                 last_name: item.user.last_name,
    //                 phone_number: item.phone_number,
    //                 username: item.user.username
    //             })
    //         }
    //     })

    // }
    // public showModal(): void {
    //     this.isVisible = true;
    // }
    // handleCancel(): void {
    //     this.isVisible = false;
    //     this.isEditing = false;
    //     this.validateForm.reset();
    //     this.editIndex = null
    // }
    // nzPageIndexChange(page: number) {
    //     this.pageIndex = page;
    //     this.getUsers()
    // }
 
    // sendRequest(sendObject) {
    //     if (this.editIndex == null) {
    //         this._driversService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: User) => {
    //             this.nzMessages.success(Messages.success)

    //             this.closeModal();
    //             if (this.driverRouteTable.length == 10) {
    //                 this.pageIndex += 1
    //             }
    //             this.getUsers()
    //         },
    //             () => {
    //                 this.nzMessages.error(Messages.fail)
    //             })
    //     } else {
    //         this._driversService.editUser(this.driverRouteTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: SalaryRespone) => {
    //             this.getUsers()

    //             this.nzMessages.success(Messages.success)
    //             this.closeModal()
    //         },
    //             () => {
    //                 this.nzMessages.error(Messages.fail)
    //             })
    //     }
    // }

    // onDeletesalary(index: number): void {
    //     this._driversService
    //         .deleteUserById(this.driverRouteTable[index].id)
    //         .pipe(
    //             takeUntil(this.unsubscribe$),
    //         )
    //         .subscribe(() => {

    //             this.driverRouteTable.splice(index, 1);

    //             this.driverRouteTable = [...this.driverRouteTable];
    //             if (!this.driverRouteTable.length && this.pageIndex !== 1) {
    //                 this.nzPageIndexChange(this.pageIndex - 1)
    //             }
    //             this.nzMessages.success(Messages.success)
    //         },
    //             () => {
    //                 this.nzMessages.error(Messages.fail)
    //             });
    // }
    // closeModal(): void {
    //     this.isVisible = false;
    //     this.validateForm.reset();
    //     this.editIndex = null
    // }

    // ngOnDestroy(): void {
    //     this.unsubscribe$.next();
    //     this.unsubscribe$.complete();
    // }
 }