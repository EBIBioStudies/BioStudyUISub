import {NgModule}            from '@angular/core';
import {CommonModule}        from '@angular/common';
import {FormsModule, ReactiveFormsModule}  from '@angular/forms';

import {
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    DropdownModule,
    ModalModule,
    PaginationModule
} from 'ng2-bootstrap';

import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';
import {ORCIDInputBoxComponent} from './orcid-input-box.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TypeaheadModule,
        TooltipModule,
        TabsModule,
        DropdownModule,
        ModalModule,
        PaginationModule
    ],
    declarations: [
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent
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
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent
    ]
})
export class SharedModule {
}