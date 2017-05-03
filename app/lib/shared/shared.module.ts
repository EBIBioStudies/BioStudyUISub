import {NgModule}            from '@angular/core';
import {CommonModule}        from '@angular/common';
import {FormsModule, ReactiveFormsModule}  from '@angular/forms';

import {
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    DatepickerModule,
    PopoverModule,
    CollapseModule,
    AlertModule
} from 'ng2-bootstrap';

import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';
import {ORCIDInputBoxComponent} from './orcid-input-box.component';
import {FileUploadButtonComponent} from './file-upload-button.component';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {MultiSelectComponent, FilterPipe} from './multi-select.component';
import {SharedService} from './shared-service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TypeaheadModule,
        TooltipModule,
        TabsModule,
        BsDropdownModule,
        ModalModule,
        PaginationModule,
        DatepickerModule,
        PopoverModule,
        CollapseModule,
        AlertModule
    ],
    providers: [
        SharedService
    ],
    declarations: [
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent,
        FileUploadButtonComponent,
        ConfirmDialogComponent,
        MultiSelectComponent,
        FilterPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TypeaheadModule,
        TooltipModule,
        TabsModule,
        BsDropdownModule,
        ModalModule,
        PaginationModule,
        DatepickerModule,
        PopoverModule,
        CollapseModule,
        AlertModule,
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent,
        FileUploadButtonComponent,
        ConfirmDialogComponent,
        MultiSelectComponent,
        FilterPipe
    ]
})
export class SharedModule {
}