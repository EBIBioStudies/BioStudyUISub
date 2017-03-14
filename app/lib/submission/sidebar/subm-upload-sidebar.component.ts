import {
    Component,
    Input,
    Output,
    EventEmitter,
    Inject
} from '@angular/core';

import {SubmissionUploadService} from '../submission-upload.service';

@Component({
    selector: 'subm-upload-sidebar',
    template: `
<aside class="left-side sidebar sidebar-offcanvas"
       [ngClass]="{'collapse-left' : collapsed}"
       *ngIf="!readonly">
    <ul class="sidebar-menu">
        <li class="menu-toggle">
            <a (click)="onToggle($event)">
                 <i class="fa fa-bars fa-fw"></i> 
                 <span *ngIf="!collapsed">Minimise</span>
            </a>
        </li>
    </ul>    
    <div *ngIf="!collapsed" style="margin: 5px;">
        <form id="subm-upload-form" 
              name="submUploadForm"
              novalidate 
              role="form" 
              method="post"
              (ngSubmit)="onSubmit($event)" 
              #uploadForm="ngForm">
            
              
            <div class="form-group">
                <label>File</label>
                <div>
                    <small class="form-text text-muted">{{fileName}}</small>               
                </div>
                <file-upload-button title="Browse file..." 
                                    (select)="onUploadFilesSelect($event)"></file-upload-button>
            </div>
            <div class="form-group">
                <label for="">Format</label>
                <select id="formatSelect" 
                        class="form-control">
                   <option disabled selected value> -- autodetect -- </option>
                   <option value="xlsx">xlsx</option>
                   <option value="xls">xls</option>
                   <option value="json">json</option>
                   <option value="csv">csv</option>
                   <option value="tsv">tsv</option>
                </select>
            </div>
            <hr/>
            <div>
                <!--span *ngIf="submitting"><i class="fa fa-spinner fa-spin"></i></span-->
                <button type="submit"
                        class="btn btn-primary btn-sm pull-right"
                        [disabled]="!canSubmit">Submit</button>
            </div>
        </form>
    </div>
</aside>
`
})

export class SubmissionUploadSideBarComponent {
    @Input() collapsed?: boolean = false;
    @Input() readonly?: boolean = false;
    @Output() toggle? = new EventEmitter();

    private model = {
        file: undefined,
        format: undefined
    };


    constructor(@Inject(SubmissionUploadService) private submUploadService: SubmissionUploadService) {
    }

    onToggle(e): void {
        e.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
        }
    }

    private get fileName(): string {
        return this.model.file ? this.model.file.name : 'No file selected';
    }

    private get canSubmit(): boolean {
        return this.model.file !== undefined;
    }

    private onUploadFilesSelect(files: File[]): void {
        if (files.length > 0) {
            this.model.file = files[0];
            this.model.format = '';
        }
    }

    private onSubmit() {
        if (!this.canSubmit) {
            return;
        }
        this.submUploadService.upload(this.model.file, this.model.format);
    }
}