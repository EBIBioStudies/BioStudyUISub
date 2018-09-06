import {Component} from '@angular/core';

import {AgRendererComponent} from 'ag-grid-angular/src/interfaces';
import {FileUpload} from '../../shared/file-upload.service';

@Component({
    selector: 'progress-cell',
    template: `
        <div *ngIf="value >= 1 && value < 100" class="progress"
             style="margin-bottom: 0;">
            <div class="progress-bar" role="progressbar"
                 [ngStyle]="{ 'width': value + '%'}">
                {{value}}%
            </div>
        </div>
        <div *ngIf="value === 100" class="text-success text-center"><i class="fa fa-check"></i></div>
        <div *ngIf="value < 0" class="text-danger text-center"><i class="fa fa-times-circle"></i> {{error}}</div>
    `
})
export class ProgressCellComponent implements AgRendererComponent {
    private upload?: FileUpload;
    private type?: string;

    agInit(params: any): void {
        this.type = params.data.type;
        this.upload = params.data.upload;
    }

    get value(): number {
        if (this.upload) {
            if (this.upload.isFailed()) {
                return -1;
            }
            return this.upload.progress;
        }
        if (this.type === 'FILE' || this.type === 'ARCHIVE') {
            return 100;
        }
        return 0;
    }

    get error(): string {
        return ((this.upload || {}) as any).error || '';
    }

    /**
     * Mandatory - Get the cell to refresh.
     * @see {@link https://www.ag-grid.com/javascript-grid-cell-editor/}
     * @returns {boolean} By returning false, the grid will remove the component from the DOM and create
     * a new component in it's place with the new values.
     */
    refresh(): boolean {
        return false;
    }
}