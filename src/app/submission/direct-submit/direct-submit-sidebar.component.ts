import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';

import {DirectSubmitService} from './direct-submit.service';
import {SubmissionService} from '../shared/submission.service';

@Component({
    selector: 'direct-submit-sidebar',
    templateUrl: './direct-submit-sidebar.component.html',
    styleUrls: ['./direct-submit-sidebar.component.css']
})

export class DirectSubmitSideBarComponent implements OnInit {
    @Input() collapsed? = false;
    @Input() readonly? = false;
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

    private isLoading: boolean;         //flags request in progress
    private projectsToAttachTo: string[] = [];

    constructor(private directSubmitService: DirectSubmitService,
                private submService: SubmissionService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.submService.getProjects()
            .subscribe(data => {
                this.projectsToAttachTo = data.map(s => s.accno);
                this.isLoading = false;
            }, () => {
                this.isLoading = false;
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