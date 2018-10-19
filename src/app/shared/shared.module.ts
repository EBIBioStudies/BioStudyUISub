import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';

import {
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    BsDropdownModule,
    ModalModule,
    DatepickerModule,
    PopoverModule,
    CollapseModule,
    AlertModule
} from 'ngx-bootstrap';

import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';
import {ORCIDInputBoxComponent} from './orcid-input-box.component';
import {FileUploadButtonComponent} from './file-upload-button.component';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {MultiSelectComponent, FilterPipe} from './multi-select.component';
import {ValidateOnBlurDirective} from "./validate-onblur.directive";
import {StripHtmlPipe} from "./strip-html.pipe";
import {DateFormatDirective} from './date-format.directive';
import {DateInputComponent} from './date-input.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TypeaheadModule,
        TooltipModule,
        TabsModule,
        BsDropdownModule,
        ModalModule,
        DatepickerModule,
        PopoverModule,
        CollapseModule,
        AlertModule
    ],
    providers: [],
    declarations: [
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent,
        FileUploadButtonComponent,
        ConfirmDialogComponent,
        MultiSelectComponent,
        FilterPipe,
        StripHtmlPipe,
        ValidateOnBlurDirective,
        DateFormatDirective,
        DateInputComponent
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
        FilterPipe,
        StripHtmlPipe,
        ValidateOnBlurDirective,
        DateFormatDirective,
        DateInputComponent
    ]
})
export class SharedModule {
}