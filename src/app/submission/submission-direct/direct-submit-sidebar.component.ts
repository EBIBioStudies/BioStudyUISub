import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserData } from 'app/auth/shared';
import { FileUploadButtonComponent } from 'app/shared/file-upload-button.component';
import { Observable, from, Subject, Subscription } from 'rxjs';
import { last, mergeAll } from 'rxjs/operators';
import { AppConfig } from 'app/app.config';
import { DirectSubmitService } from './direct-submit.service';
import { DirectSubmitFileUploadService } from './direct-submit-file-upload.service';
import { UploadEvent } from 'app/file/shared/http-upload-client.service';

@Component({
    selector: 'direct-submit-sidebar',
    templateUrl: './direct-submit-sidebar.component.html',
    styleUrls: ['./direct-submit-sidebar.component.css']
})
export class DirectSubmitSideBarComponent implements OnInit {
    protected ngUnsubscribe: Subject<void>; // Stopper for all subscriptions
    private uploadSubs?: Subscription; // Subscription for the battery of upload requests
    private uploadFilesSubscription?: Subscription;
    private model: { files: any | undefined[], projects: any | undefined[] } = {
        files: undefined, // No file selection at first
        projects: [] // Chebox-ised representation of project list
    };
    isProjFetch: boolean = true; // Are projects still being retrieved?
    isBulkMode: boolean = false; // Flags if single directory with all study files is expected
    isBulkSupport: boolean = false; // Indicates if directory selection is supported by the browser
    submitType: string = 'create'; // Will the upload create or update studies?
    selectedProj: string[] = []; // Projects selected for attachment

    @Input() collapsed? = false;
    @Input() readonly? = false;
    @Output() toggle? = new EventEmitter();

    @ViewChild(FileUploadButtonComponent)
    private fileSelector;

    /**
     * Initializes subscription stopper so that pending requests can be cancelled on view destruction.
     *
     * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
     * @param {DirectSubmitService} submitSvc - Singleton service for all submission transactions.
     * @param {FileUploadList} fileUpload - Service to upload files.
     * @param {UserData} userData - Singleton service for fetching and accessing the current user's profile data.
     */
    constructor(
        private appConfig: AppConfig,
        private directSubmitSvc: DirectSubmitService,
        private directSubmitFileUploadService: DirectSubmitFileUploadService,
        private userData: UserData
    ) {
        this.ngUnsubscribe = new Subject<void>();
    }

    /**
     * Gets the current number of selected files, normalising to 0 if there are none.
     * NOTE: When successful uploads are cleared, the selected file count must reflect that. Hence the boolean filter.
     * @see {@link clearUploads}
     * @returns {number} Number of files selected.
     */
    get selectedFileCount(): number {
        if (this.model.files) {
            return this.model.files!.filter(Boolean).length;
        } else {
            return 0;
        }
    }

    get hasRequests(): boolean {
        return this.directSubmitSvc.requestCount > 0;
    }

    /**
     * Gives the number of files that have not been uploaded yet. Before any requests are made, this number will
     * be assumed to be equal to the number of selected files.
     * @returns {number} Count of pending files.
     */
    get pendingFiles(): number {
        if (this.directSubmitSvc.requestCount) {
            return this.directSubmitSvc.pendingCount;
        } else {
            return this.selectedFileCount;
        }
    }

    /**
     * Calculates the global progress rate of all active uploads.
     * @returns {number} Percentage of completed queued requests.
     */
    get progress(): number {
        return Math.floor((this.selectedFileCount - this.pendingFiles) * 100 / this.selectedFileCount);
    }

    /**
     * Gives the number of files whose upload has failed. Before any requests are made, this number will
     * be assumed to be equal to 0.
     * @returns {number} Count of erroneous files.
     */
    get errorFiles(): number {
        if (this.directSubmitSvc.requestCount) {
            return this.directSubmitSvc.errorCount;
        } else {
            return 0;
        }
    }

    /**
     * Can't submit unless a file path has been set and no other transaction is in progress.
     */
    get canSubmit(): boolean {
        return !this.isProjFetch && this.selectedFileCount > 0;
    }

    /**
     * Acts as Angular's "touched" attribute for the file upload button.
     */
    get fileTouched() {
        return this.model.files !== undefined;
    }

    /**
     * Fetches the list of allowed projects for the current user on component initialisation. It only does so after
     * the request for user data has completed successfully since it is only then when relevant project authorisation
     * is known.
     */
    ngOnInit(): void {
        this.userData.projectAccNumbers$.subscribe(projects => {
            this.model.projects = this.initProjModel(projects);
            this.isProjFetch = false;
        }, () => {
            this.isProjFetch = false;
        });
    }

    ngDoCheck() {
        this.isBulkSupport = this.fileSelector && this.fileSelector.isDirSupport;
    }

    /**
     * Removes all subscriptions whenever the user navigates away from this view. Also clears the request queue.
     * NOTE: Requires the takeUntil operator before every subscription.
     * @see {@link https://stackoverflow.com/a/41177163}
     */
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.directSubmitSvc.reset();
    }

    /**
     * Convenience method to find out whether the request queue has pending requests or not.
     * @param {string} status - Status being probed.
     * @returns {boolean} True if the queue is with the status passed in.
     */
    isStatus(status: string): boolean {
        return this.directSubmitSvc.isQueueStatus(status);
    }

    /**
     * Convenience method to the get the value of a given request's property.
     * @param {number} studyIdx - Index for the request.
     * @param {string} property - Name of the property whose value is to be retrieved.
     * @returns {string} Value of the property.
     */
    studyProp(studyIdx: number, property: string): string {
        const request = this.directSubmitSvc.getRequest(studyIdx);

        return typeof request !== 'undefined' ? request[property] : '';
    }

    /**
     * Converts a list of projects into a data object suitable for checkbox controls.
     * @param {string[]} projects - Names of projects.
     * @returns {{name: string; checked: boolean}[]} Checkbox-compliant object.
     */
    private initProjModel(projects: string[]): { name: string, checked: boolean }[] {
        return projects.map(name => {
            return { name: name, checked: false };
        });
    }

    /**
     * Surgically updates the list of selected projects without destroying it in the process.
     * NOTE: Angular's change detection cycle tends to work best when the original array is not wiped out such as
     * when using map.
     * @param {Event} event - DOM object for the click action.
     */
    private onProjChange(event: Event) {
        const checkboxEl = <HTMLInputElement>event.target;

        if (checkboxEl.checked) {
            this.selectedProj.push(checkboxEl.value);
        } else {
            this.selectedProj.splice(this.selectedProj.indexOf(checkboxEl.value), 1);
        }
    }

    /**
     * Converts a list of would-be upload files into a native array. The upload service is reset as part of the
     * process since it signals the start of a new upload process and allows treating the list of files as
     * "nascent uploads".
     *
     * @param {FileList} files - List of files to be uploaded.
     */
    private onUploadFilesSelect(files: FileList): void {
        if (files.length > 0) {
            this.model.files = Array.from(files);
            this.directSubmitSvc.reset();
        }
    }

    /**
     * Cancels all currently pending requests by unsubscribing from the aggregated observable and updating their
     * respective statuses.
     */
    private onCancelPending() {
        this.uploadSubs!.unsubscribe();
        this.uploadFilesSubscription!.unsubscribe();
        this.directSubmitSvc.cancelAll();
    }

    /**
     * Marks successful uploads as not present or unselected by setting the corresponding indexed member to null.
     * NOTE: Angular's change detection cycle tends to work best when the original array is not wiped out such as
     * when using map.
     * NOTE: The files list is independent of the requests one. A difference in length between the two would lead to
     * state inconsistencies. Hence also the conservative assignment approach.
     */
    private clearUploads() {
        const files = this.model.files;

        files.forEach((_file, index) => {
            if (this.directSubmitSvc!.getRequest(index)!.successful) {
                files[index] = null;
            }
        });
    }

    /**
     * Signals the UI that the files input has been blurred an is invalid. Since the actual input is never "touched"
     * -to use Angular terminology-, the state is inferred from the input's value. Within this context, "null" indicates
     * a blank field.
     */
    private markFileTouched() {
        this.model.files = null;
    }

    /**
     * Carries out the necessary requests for the selected files, detecting their format automatically.
     * NOTE: Requests are bundled into groups of MAX_CONCURRENT requests to avoid overwhelming the browser and/or
     * the server when dealing with a high number of files.
     *
     * @param {string} submissionType - Indicates whether the submitted file should create or update an existing database entry.
     */
    private onSubmit(submissionType: string): void {
        let nonClearedFiles;

        if (this.canSubmit) {
            nonClearedFiles = this.model.files.filter(Boolean);

            this.uploadFilesSubscription = this.uploadFiles(nonClearedFiles).subscribe((uploadEvent) => {
                if (uploadEvent.isSuccess()) {
                    this.uploadSubs = this.createDirectSubmission(nonClearedFiles, submissionType).subscribe();
                }
            });

            // Most probably file selection was left out.
        } else {
            this.markFileTouched();
        }
    }

    private createDirectSubmission(files: File[], submissionType: string): Observable<any> {
        // In case the same files are re-submitted, the previous list of requests is reset.
        this.directSubmitSvc.reset();

         // Performs the double-request submits and flattens the resulting high-order observables onto a single one.
        return from(files)
            .map((file: File) => this.directSubmitSvc.addRequest(file, '', this.selectedProj, submissionType))
            // Throttles the number of requests allowed in parallel and takes just the last event
            // to signal the end of the upload process.
            .pipe(mergeAll(this.appConfig.maxConcurrent))
            .pipe(last())
            // Cancels all requests on demand and keeps the files list in sync with the list of requests.
            .takeUntil(this.ngUnsubscribe)
            .finally(() => this.model.files = files);
    }

    private uploadFiles(files: File[]): Observable<any> {
        return from(files)
            .map((file) => this.directSubmitFileUploadService.doUpload(file))
            .pipe(mergeAll(this.appConfig.maxConcurrent))
            .pipe(last())
            .takeUntil(this.ngUnsubscribe);
    }

    /**
     * Notifies the outside world if the collapsed state of the sidebar has changed.
     * @param {Event} event - DOM object for the click action.
     */
    onToggle(event: Event): void {
        event.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
        }
    }
}
