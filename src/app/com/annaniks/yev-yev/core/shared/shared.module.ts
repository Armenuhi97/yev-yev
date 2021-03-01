import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { IconsProviderModule } from "src/app/icons.provider.module";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';

@NgModule({
    declarations: [],
    imports: [CommonModule,NzModalModule,NzIconModule, FormsModule, ReactiveFormsModule],
    exports: [CommonModule, FormsModule, ReactiveFormsModule,
        NzCalendarModule,
        NzLayoutModule,
        NzIconModule,
        NzMenuModule,
        NzFormModule,
        NzButtonModule,
        NzCheckboxModule,
        NzInputModule,
        NzTableModule,
        NzModalModule,
        NzCardModule,
        NzMessageModule,
        NzUploadModule,
        NzPopconfirmModule,
        NzTabsModule,
        NzSwitchModule,
        NzSelectModule,
        NzCollapseModule,
        NzDatePickerModule,
        NzCascaderModule,
        NzGridModule,
        NzDividerModule,
        NzStatisticModule,
        NzListModule,
        NzSkeletonModule,
        NzSpinModule,
        NzRadioModule,
        NzTimePickerModule,
        NzAutocompleteModule,
        NzStepsModule,
        NzDescriptionsModule,
        NzSpaceModule,
        NzBadgeModule,
        IconsProviderModule
    ]
})
export class SharedModule { }