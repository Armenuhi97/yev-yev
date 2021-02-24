import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { CityItem } from "../../../../core/models/city.model";
import { Messages } from "../../../../core/models/mesages";
import { RouteItem } from "../../../../core/models/routes.model";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { SettingsService } from "../../setting.service";

@Component({
    selector: 'app-routes',
    templateUrl: 'routes.component.html',
    styleUrls: ['routes.component.scss']
})
export class RoutesComponent {
    routeTable: RouteItem[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number;
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    validateForm: FormGroup;
    editIndex: number = null;
    routeSubList = [];
    cityTable: CityItem[] = []
    @Input('array')
    set setArray($event: RouteItem[]) {
        this.routeTable = $event
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
            name: [null, Validators.required],
            routes: this._fb.array([])
        })
        this.validateRoute()
    }
    validateRoute() {
        let value = this.validateForm.get('routes') as FormArray;
        let items = this._fb.group({
            start_point: [null],
            start_point_address_en: [null],
            start_point_address_ru: [null],
            start_point_address_hy: [null],
            start_point_is_static: [false],
            end_point: [null],
            end_point_address_en: [null],
            end_point_address_ru: [null],
            end_point_address_hy: [null],
            end_point_is_static: [false]
        })
        for (let val of [1, 2]) {
            value.push(items)
        }
        console.log(this.validateForm.get('routes')['controls']);
        
        console.log(value);
        
    }
    public getAllRoutes() {
        this._settingsService.getAllRoutes(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<RouteItem[]>) => {
            this.total = data.count;
            this.routeTable = data.results;
        })

    }
    public getAllcities() {
        return this._settingsService.getAllCities(this.pageIndex).pipe(map((data: ServerResponce<CityItem[]>) => {
            this.total = data.count;
            this.cityTable = data.results;
            return data
        }))
    }
    onEditRoute(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.getRouteById(this.routeTable[this.editIndex].id);
        this.showModal()
    }
    private _combineObsevable(id) {
        const combine = forkJoin(
            this.getAllcities(),
            this.getRouteSubList(id)
        )
        return combine
    }
    public getRouteById(id: number) {        
        this._settingsService.getRouteById(id).pipe(takeUntil(this.unsubscribe$),
            switchMap((data) => {
                this.validateForm.patchValue({ name: data.route_name })
                return this._combineObsevable(id)
            })).subscribe()
    }

    getRouteSubList(id: number) {
        return this._settingsService.getRouteSubList(id).pipe(
            map((data) => {
                return data
            })
        )
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
        this.getAllRoutes()
    }
    public onRouteSave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }
        if (this.editIndex == null) {
            this._settingsService.addRoutes(this.validateForm.get('name').value).pipe(takeUntil(this.unsubscribe$)).subscribe((data: RouteItem) => {
                this.total += 1;
                this.routeTable.push(data);
                this.nzMessages.success(Messages.success)

                this.closeModal();
            },
                () => {
                    this.nzMessages.success(Messages.fail)
                })
        } else {
            this._settingsService.editRoute(this.routeTable[this.editIndex].id, this.validateForm.get('name').value).pipe(takeUntil(this.unsubscribe$)).subscribe((data: RouteItem) => {
                this.routeTable[this.editIndex].route_name = data.route_name;
                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.success(Messages.fail)
                })
        }
    }
    onDeleteRoute(index: number): void {
        this._settingsService
            .deleteRoute(this.routeTable[index].id)
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
                this.routeTable.splice(index, 1);
                this.routeTable = [...this.routeTable];
                if (!this.routeTable.length && this.pageIndex !== 1) {
                    this.nzPageIndexChange(this.pageIndex - 1)
                }
                this.nzMessages.success(Messages.success)
            },
                () => {
                    this.nzMessages.success(Messages.fail)
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