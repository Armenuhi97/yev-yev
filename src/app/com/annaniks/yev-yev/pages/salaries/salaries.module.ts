import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { SalariesRoutingModule } from "./salaries-routing.module";
import { SalariesComponent } from "./salaries.component";
import { SalaryService } from "./salaries.service";

@NgModule({
    declarations: [SalariesComponent],
    imports: [SharedModule, SalariesRoutingModule],
    providers:[SalaryService]
})
export class SalariesModule { }