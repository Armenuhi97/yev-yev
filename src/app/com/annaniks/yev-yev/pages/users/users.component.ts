import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { of, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Messages } from "../../core/models/mesages";
import { Client } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { MainService } from "../main/main.service";
import { UsersService } from "./users.service";

@Component({
    selector: 'app-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.scss']
})
export class UsersComponent {
    sortItems = []
    userId: number;
    clientTable: Client[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number;
    search = new FormControl('')
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    validateForm: FormGroup;
    editIndex: number = null;
    public activeTab: number = 0;
    userName: string;
    count: number = 0;
    clientRating: any = [];
    constructor(private _userService: UsersService,
        private nzMessages: NzMessageService,
        private _mainService: MainService,
        private _fb: FormBuilder,
        private _httpClient: HttpClient) {
    }

    ngOnInit() {
        this._initForm();
        this.getUsers().pipe(takeUntil(this.unsubscribe$),
            switchMap(() => {
                return this.subscribeToSearch()
            })).subscribe();
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            first_name: [null, Validators.required],
            last_name: [null, Validators.required],
            phone_number: [null, Validators.required],
            comment: [null]
        })
    }

    public subscribeToSearch() {
        return this.search.valueChanges.pipe(takeUntil(this.unsubscribe$),
            switchMap((value) => {
                if (!value) {
                    return this.getUsers(this.search.value)
                } else {
                    return of()
                }
            }))
    }

    public searchUser() {
        // this.search.valueChanges.pipe(takeUntil(this.unsubscribe$),
        // switchMap((value) => {
        this.getUsers(this.search.value).pipe(takeUntil(this.unsubscribe$)).subscribe()
        // })).subscribe()
    }
    public changeUserStatus($event, id: number) {
        this._userService.editUser(id, { is_active: $event }).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    public getUsers(search?) {
        let ordering = this.sortItems && this.sortItems.length ? this.sortItems.join(',') : '';

        return this._userService.getUsers(this.pageIndex, (this.pageIndex - 1) * 10, search, ordering).pipe(
            map((data: ServerResponce<Client[]>) => {
                this.total = data.count;
                this.clientTable = data.results;
                return data
            }))
    }

    onEditclient(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.userId = this.clientTable[this.editIndex].id
        this.getclientById(this.clientTable[this.editIndex].id);
        this.showModal()
    }
    public getclientById(id: number) {
        this._userService.getUserById(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<Client>) => {
            if (data.results && data.results[0]) {
                let item = data.results[0];
                this.userName = `${item.user.first_name} ${item.user.last_name}`
                this.validateForm.patchValue({
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    phone_number: item.phone_number,
                    comment: item.comment
                })
            }
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
        this.activeTab = 0;
        this.userId = null
        this.userName = null
    }
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    public onclientSave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }
        let sendObject = {
            "first_name": this.validateForm.get('first_name').value,
            "last_name": this.validateForm.get('last_name').value,
            "phone_number": this.validateForm.get('phone_number').value,
            "image": '',
            "comment": this.validateForm.get('comment').value ? this.validateForm.get('comment').value : '',
        }
        this.sendRequest(sendObject);
    }
    sendRequest(sendObject) {
        if (this.editIndex == null) {
            this._userService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Client) => {
                this.nzMessages.success(Messages.success)
                this.closeModal();
                this.pageIndex = 1;
                this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        } else {
            this._userService.editUser(this.clientTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
                this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe()
                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        }
    }
    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.editIndex = null
        this.userId = null;
        this.activeTab = 0;
        this.userName = null;
        this.sortItems = []
    }

    sort(sort, key: string): void {
        if (sort == 'ascend') {

            this._deleteKeyFromSort(`-${key}`)
            if (this._checkIsExist(key) == -1) {
                this.sortItems.push(key);
                // this.pageIndex = 1;
                this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe();

            }
        } else {
            if (sort == 'descend') {
                this._deleteKeyFromSort(`${key}`)
                if (this._checkIsExist(`-${key}`) == -1) {
                    this.sortItems.push(`-${key}`)
                    // this.pageIndex = 1;
                    this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe();
                }
            } else {
                this._deleteKeyFromSort(`${key}`);
                this._deleteKeyFromSort(`-${key}`);
                // this.pageIndex = 1;
                this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe();

            }
        }
    }
    private _checkIsExist(key: string): number {
        let index = this.sortItems.indexOf(key);
        return index
    }
    private _deleteKeyFromSort(key: string) {
        let index = this.sortItems.indexOf(key);
        if (index > -1) {
            this.sortItems.splice(index, 1)

        }
    }
    public onChangeTab($event) {
        this.activeTab = $event;
        if (this.activeTab === 2) {
            this.getRatingResults();
        }
    }


    public getRatingResults(): void {
        this._userService.getRating(this.userId)
            .subscribe((res: any) => {
                this.clientRating = res.results;
                this.count = res.count;
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }




}