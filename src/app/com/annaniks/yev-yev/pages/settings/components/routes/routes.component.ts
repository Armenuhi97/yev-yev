import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, of, Subject, throwError } from "rxjs";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators";
import { CityItem } from "../../../../core/models/city.model";
import { Messages } from "../../../../core/models/mesages";
import { RouteItem } from "../../../../core/models/routes.model";
import { User } from "../../../../core/models/salary";
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
    salaries: User[]
    moderator;
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
            routes: this._fb.array([]),
            moderator: [null]
        })
        // this.validateRoute()
    }

    public getUsers() {
        return this._settingsService.getUsers().pipe(map((data: ServerResponce<User[]>) => {
            this.total = data.count;
            this.salaries = data.results;


        }))
    }

    addField() {
        let value = this.validateForm.get('routes') as FormArray;
        let item = this._fb.group({
            start_point: [null],
            start_point_address_en: [null],
            start_point_address_ru: [null],
            start_point_address_hy: [null],
            start_point_is_static: [false],
            end_point: [null],
            id: [null],
            end_point_address_en: [null],
            end_point_address_ru: [null],
            end_point_address_hy: [null],
            end_point_is_static: [false]
        })
        value.push(item);




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
            this.getUsers(),
            this.getRouteSubList(id)
        )
        return combine
    }
    public getRouteById(id: number) {
        this._settingsService.getRouteById(id).pipe(takeUntil(this.unsubscribe$),
            switchMap((data) => {
                this.validateForm.patchValue({
                    name: data.route_name,
                    moderator: data.moderator_details && data.moderator_details.length ? data.moderator_details[0].user : null

                })
                if (data.moderator_details && data.moderator_details.length) {
                    this.moderator = data.moderator_details[0].user
                }
                return this._combineObsevable(id)
            })).subscribe()
    }

    getRouteSubList(id: number) {
        return this._settingsService.getRouteSubList(id).pipe(
            map((data: ServerResponce<any>) => {
                let subList = data.results;
                if (subList && subList.length) {
                    ((this.validateForm.get('routes')) as FormArray).controls = subList.map((el) => {
                        return this._fb.group({
                            end_point: el.end_point,
                            end_point_address_en: el.end_point_address_en,
                            end_point_address_hy: el.end_point_address_hy,
                            end_point_address_ru: el.end_point_address_ru,
                            end_point_is_static: el.end_point_is_static,
                            start_point: el.start_point,
                            id: el.id,
                            start_point_address_en: el.start_point_address_en,
                            start_point_address_hy: el.start_point_address_hy,
                            start_point_address_ru: el.start_point_address_ru,
                            start_point_is_static: el.start_point_is_static,
                        })
                    })

                }


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
        this.validateForm.get('routes')['controls'] = []
        this.editIndex = null
        this.moderator = null
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
                    this.nzMessages.error(Messages.fail)
                })
        } else {
            return this._settingsService.editRoute(this.routeTable[this.editIndex].id, this.validateForm.get('name').value).pipe(takeUntil(this.unsubscribe$),
                switchMap((data: RouteItem) => {
                    this.routeTable[this.editIndex].route_name = data.route_name;
                    if (this.validateForm.get('moderator').value && this.validateForm.get('moderator').value !== this.moderator) {
                        return this._settingsService.addModeratorForRoute(this.routeTable[this.editIndex].id, this.validateForm.get('moderator').value)
                    } else {
                        return of()
                    }
                })).subscribe(() => {
                    this.nzMessages.success(Messages.success)
                    this.closeModal()
                },
                    (err) => {
                        if (err && err.error && err.error.non_field_errors && err.error.non_field_errors[0]) {
                            this.nzMessages.error('Տվյալ աշխատակիցը կցված է այլ ուղղության')
                        } else {
                            this.nzMessages.error(Messages.fail)
                        }
                    })
        }
    }
    public saveSubList(index: number) {
        let formArray = (this.validateForm.get('routes') as FormArray).controls;
        if (formArray[index].value) {
            let value = formArray[index].value;
            
            let sendObject = Object.assign({}, value, { main_route: this.routeTable[this.editIndex].id })
            if (formArray[index].value.id) {
                delete sendObject.id
                this._settingsService.editSubRoute(formArray[index].value.id,sendObject).pipe(takeUntil((this.unsubscribe$))).subscribe(() => {
                    this.nzMessages.success(Messages.success)
                },
                    () => {
                        this.nzMessages.error(Messages.fail)
                    }
                )
            } else {
                delete sendObject.id
                this._settingsService.addSubRoute(sendObject).pipe(takeUntil((this.unsubscribe$))).subscribe(() => {
                    this.nzMessages.success(Messages.success)
                },
                    () => {
                        this.nzMessages.error(Messages.fail)
                    }
                )
            }
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
                    this.nzMessages.error(Messages.fail)
                });
    }
    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.validateForm.get('routes')['controls'] = [];
        this.editIndex = null
        this.moderator = null
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}