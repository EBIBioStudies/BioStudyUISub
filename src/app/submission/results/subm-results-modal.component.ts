import {
    Component,
    Input
} from '@angular/core';

import {
    Router
} from '@angular/router';

import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';

/**
 * UI component for the modal being rendered with a given study's submission results.
 */
@Component({
    selector: 'subm-results',
    templateUrl: './subm-results-modal.component.html'
})
export class SubmResultsModalComponent {
    @Input() status: string;        //Status the server comes back with
    @Input() accno: string;         //Submission's accession number
    @Input() log: any;              //Log part of the server's response

    constructor(private router: Router,
                public bsModalRef: BsModalRef) {
    }

    get location() {
        return window.location;
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

    /**
     * Handler for confirmation event. Hides the modal, possibly redirecting to list of sent submissions.
     */
    onConfirm(): void {
        this.bsModalRef.hide();
        this.isSuccess() && this.router.navigate(['/submissions/sent']);
    }
}
