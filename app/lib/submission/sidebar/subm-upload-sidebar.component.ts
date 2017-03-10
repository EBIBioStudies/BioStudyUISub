import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

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
                   <option value="json">json</option>
                   <option value="exel">excel</option>
                </select>
            </div>
            <hr/>
            <div>
                <button type="submit"
                        class="btn btn-primary btn-sm pull-right"
                        tooltip="Validate & submit"
                        [disabled]="!canSubmit">Upload</button>
                <span *ngIf="submitting"><i class="fa fa-spinner fa-spin"></i></span>
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
        submFile: undefined,
        format: undefined
    };

    onToggle(e): void {
        e.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
        }
    }

    private get fileName(): string {
        return this.model.submFile ? this.model.submFile.name : 'No file selected';
    }

    private get canSubmit(): boolean {
        return this.model.submFile && this.model.format;
    }

    private onUploadFilesSelect(files: File[]): void {
        if (files.length > 0) {
            this.model.submFile = files[0];
            this.model.format = this.detectFileFormat(files[0].name);
        }
    }

    private detectFileFormat(fileName: string): string {
        if (!fileName) {
            return undefined;
        }
        //todo use
        return undefined;
    }

    private onSubmit() {
        if (!this.canSubmit) {
            return;
        }

    }
}