import {NgModule}            from '@angular/core';
import {CommonModule}        from '@angular/common';
import {FormsModule, ReactiveFormsModule}  from '@angular/forms';

import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        ContainerRootComponent,
        ContainerMdComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ContainerRootComponent,
        ContainerMdComponent
    ]
})
export class SharedModule {
}