import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import {DirectSubmitService} from './direct-submit.service';
import {UserData} from "../../auth/user-data";

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
        {name: 'Detect automatically', value: ''},
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

    private isBusy: boolean = false;                     //flags request in progress
    private projectsToAttachTo: string[] = [];           //available projects fetched asynchronously

    constructor(private directSubmitService: DirectSubmitService,
                private userData: UserData) {
    }

    ngOnInit(): void {
        this.isBusy = true;
        this.userData.whenFetched.subscribe((data) => {
            this.projectsToAttachTo = data['projects'].map(s => s.accno);
            this.isBusy = false;
        }, () => {
            this.isBusy = false;
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

    //Can't submit unless a file path has been set and no other transaction is in progress.
    private get canSubmit(): boolean {
        return !this.isBusy && !!this.model.file;
    }

    private onUploadFilesSelect(files: File[]): void {
        if (files.length > 0) {
            this.model.file = files[0];
            this.model.format = '';
        }
    }

    //Acts as Angular's "touched" attribute for the file upload button
    private get fileTouched() {
        return this.model.file !== undefined;
    }

    private markFileTouched() {
        this.model.file = '';
    }

    private onSubmit(submType: string): void {
        const model = this.model;

        if (this.canSubmit) {
            this.isBusy = true;
            this.directSubmitService.addRequest(model.file, model.format, model.projects, submType).subscribe(
                () => {
                    this.isBusy = false;
                },
                (error) => {
                    this.isBusy = false;
                    console.error(error);
                }
            );
        } else if (!this.isBusy) {
            this.markFileTouched();
        }
    }
}