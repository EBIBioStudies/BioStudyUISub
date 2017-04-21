import {
    Component,
    Input,
    Output,
    EventEmitter,
    Inject,
    OnInit
} from '@angular/core';

import {DirectSubmitService} from '../direct-submit.service';
import {SubmissionService} from '../submission.service';

import * as _ from 'lodash';

@Component({
    selector: 'direct-submit-sidebar',
    template: `
<aside class="left-side sidebar sidebar-offcanvas"
       [ngClass]="{'collapse-left' : collapsed}"
       *ngIf="!readonly">
    <ul class="sidebar-menu">
        <li class="sidebar-item menu-toggle">
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
                <select name="formatSelect" 
                        class="form-control"
                        [(ngModel)]="model.format">
                    <option *ngFor="let format of formats" [value]="format.value" [selected]="model.format === format.value">
                        {{format.name}}
                    </option>     
                </select>
            </div>
            <div class="form-group">
                <label for="">Attach To</label>
                <ul>
                   <li *ngFor="let p of model.projects">{{p}}</li>
                </ul>
                <multi-select
                     name="selectedProjects"
                    [options]="projectsToAttachTo" 
                    [(ngModel)]="model.projects"></multi-select>
            </div>
            <hr/>
            <div>
                <!--span *ngIf="submitting"><i class="fa fa-spinner fa-spin"></i></span-->
                <!--button type="submit"
                        class="btn btn-primary btn-sm pull-right"
                        [disabled]="!canSubmit">Submit</button-->
                        
                <div class="btn-group pull-right" dropdown>
                    <button id="single-button" 
                            type="button" 
                            class="btn btn-primary btn-sm" 
                            [disabled]="!canSubmit"
                            dropdownToggle>
                       Submit as... <span class="caret"></span>
                    </button>
                    <ul dropdownMenu role="menu" aria-labelledby="single-button">
                        <li role="menuitem"><a class="dropdown-item" (click)="onCreate()">New</a></li>
                        <li role="menuitem"><a class="dropdown-item" (click)="onUpdate()">Existing</a></li>
                    </ul>
                </div>
            </div>
        </form>
    </div>
</aside>
`
})

export class DirectSubmitSideBarComponent implements OnInit {
    @Input() collapsed?: boolean = false;
    @Input() readonly?: boolean = false;
    @Output() toggle? = new EventEmitter();

    private formats = [
        {name: '-- auto-detect --', value: ''},
        {name: 'xlsx', value: 'xlsx'},
        {name: 'xls', value: 'xls'},
        {name: 'json', value: 'json'},
        {name: 'csv', value: 'csv'},
        {name: 'tsv', value: 'tsv'}
    ];

    private model = {
        file: undefined,
        format: '',
        projects: []
    };

    private projectsToAttachTo: string[] = [];

    constructor(@Inject(DirectSubmitService) private directSubmitService: DirectSubmitService,
                @Inject(SubmissionService) private submService: SubmissionService) {
    }

    ngOnInit(): void {
        this.submService.getProjects()
            .subscribe(data => {
                this.projectsToAttachTo = _.map(data, s => s.accno);
            });
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

    private onCreate(): void {
        this.directSubmitService.create(this.model.file, this.model.format, this.model.projects);
    }

    private onUpdate(): void {
        this.directSubmitService.update(this.model.file, this.model.format, this.model.projects);
    }
}