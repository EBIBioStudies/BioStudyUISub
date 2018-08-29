import {
    Component,
    Input
} from '@angular/core';

import {BsModalRef} from 'ngx-bootstrap';
import {SubmissionService} from "../shared/submission.service";

/**
 * UI component for the modal being rendered with a given study's submission results.
 */
@Component({
    selector: 'subm-results',
    templateUrl: './subm-results-modal.component.html'
})
export class SubmResultsModalComponent {
    @Input() status?: string;        //Status the server comes back with
    @Input() log: any;              //Log part of the server's response
    @Input() collapsedLog?: boolean; //Flag indicating if the log tree is on display.
    @Input() modalRef?: BsModalRef;

    get errorMessage() {
        return SubmissionService.deepestError(this.log);
    }

    isLogEmpty() {
        return this.log && Object.keys(this.log).length == 0;
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
    isSuccess(): boolean {
        return this.status === 'OK';
    }
}