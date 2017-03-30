import {NgModule}            from '@angular/core';
import {CommonModule}        from '@angular/common';
import {FormsModule, ReactiveFormsModule}  from '@angular/forms';

import {
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    DropdownModule,
    ModalModule,
    PaginationModule,
    DatepickerModule,
    PopoverModule,
    CollapseModule
} from 'ng2-bootstrap';

import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';
import {ORCIDInputBoxComponent} from './orcid-input-box.component';
import {FileUploadButtonComponent} from './file-upload-button.component';
import {ConfirmDialogComponent} from './confirm-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TypeaheadModule,
        TooltipModule,
        TabsModule,
        DropdownModule,
        ModalModule,
        PaginationModule,
        DatepickerModule,
        PopoverModule,
        CollapseModule
    ],
    declarations: [
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent,
        FileUploadButtonComponent,
        ConfirmDialogComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TypeaheadModule,
        TooltipModule,
        TabsModule,
        DropdownModule,
        ModalModule,
        PaginationModule,
        DatepickerModule,
        PopoverModule,
        CollapseModule,
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent,
        FileUploadButtonComponent,
        ConfirmDialogComponent
    ]
})
export class SharedModule {
}