import {Component, Inject, Input} from '@angular/core';

@Component({
    selector: 'input-file',
    template: `
    <select  *ngIf="files.length > 0"
             class="form-control input-sm"
             [(ngModel)]="model"
             (ngModelChange)="onModelChange()"
             [required]="required">
<!--
             [readonly]="readonly"
-->
             <option *ngFor="let file of files" value="{{file}}">{{file}}</option>
    </select>
<!--TODO ui-sref="files({ bb:1 })" -->
    <a *ngIf="files.length == 0"
       class="btn btn-link">Go to File Upload</a>
`
})
export class InputFileComponent {
    @Input() required?: boolean = false;
    @Input() readonly?: boolean = false;

    files: Array<string> = [];

    constructor() {
    }

    onModelChanges() {
    }
}