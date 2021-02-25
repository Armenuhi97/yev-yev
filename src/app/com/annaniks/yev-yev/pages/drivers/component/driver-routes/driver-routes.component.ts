import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Messages } from "../../../../core/models/mesages";
import { RouteItem } from "../../../../core/models/routes.model";
import { User } from "../../../../core/models/salary";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { DriverService } from "../../drivers.service";

@Component({
    selector: 'app-driver-routes',
    templateUrl: 'driver-routes.component.html',
    styleUrls: ['driver-routes.component.scss']
})
export class DriverRoutesComponent {
    routes: RouteItem[] = []
    driverRouteTable: any[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number;
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    editIndex: number = null;
    @Output('sendItem') private _sendItem = new EventEmitter()
    public currentroute = new FormControl('', [Validators.required])
    @Input('routes')
    set setRoutes($event) {
        this.routes = $event
    }
    @Input('selectedRoutes')
    set setSelectedRoute($event: User) {
        console.log($event.driving_routes);

    }
    constructor(private _driversService: DriverService,
        private nzMessages: NzMessageService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
    }
    public onRouteSave() {
        if (this.currentroute.value) {
            this._sendItem.emit(this.currentroute.value);
            this.currentroute.reset()
            this.closeModal()
        }
    }
    public getUsers() {
        this._driversService.getUsers(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<any[]>) => {
            this.total = data.count;
            this.driverRouteTable = data.results;
        })
    }

    public showModal(): void {
        this.isVisible = true;
    }
    handleCancel(): void {
        this.isVisible = false;
        this.isEditing = false;
        this.currentroute.reset();
        this.editIndex = null
    }
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getUsers()
    }

    sendRequest(sendObject) {
        if (this.editIndex == null) {
            this._driversService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
                this.nzMessages.success(Messages.success)

                this.closeModal();
                if (this.driverRouteTable.length == 10) {
                    this.pageIndex += 1
                }
                this.getUsers()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        } else {
            this._driversService.editUser(this.driverRouteTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
                this.getUsers()

                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        }
    }
    public addItem() { }
    onDeleteRoute(index: number): void {
        this._driversService
            .deleteMainRouteToDriver(this.driverRouteTable[index].id)
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {

                this.driverRouteTable.splice(index, 1);

                this.driverRouteTable = [...this.driverRouteTable];
                if (!this.driverRouteTable.length && this.pageIndex !== 1) {
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
        this.currentroute.reset();
        this.editIndex = null
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}