import {
    Component,
    Input
} from '@angular/core';

import {BsModalRef} from 'ngx-bootstrap';
import {SubmissionService, SubmitLog} from '../shared/submission.service';

/**
 * UI component for the modal being rendered with a given study's submission results.
 */
@Component({
    selector: 'subm-results',
    templateUrl: './subm-results-modal.component.html'
})
export class SubmResultsModalComponent {
    status?: string;
    log?: SubmitLog;
    collapsedLog?: boolean = false;

    constructor(public modalRef: BsModalRef){}

    get errorMessage() {
        return this.hasLog ? SubmissionService.deepestError(this.log!!) : 'Unknown error';
    }

    get hasLog(): boolean {
        return this.log !== undefined;
    }

    /**
     * Formats the response's log section as a URI string.
     * @returns {string} Serialised contents of the log section.
     */
    toLogURI(): string {
        return encodeURIComponent(JSON.stringify(this.log));
    }

    /**
     * Checks if the request to the server was successful.
     * @returns {boolean} True if the server comes back with a success code.
     */
    get isSuccess(): boolean {
        return this.status === 'OK';
    }

    get isError(): boolean {
        return !this.isSuccess;
    }
}