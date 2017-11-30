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
    @Input() log: any;          //Log part of the server's response
    @Input() mapping: any[];    //Mapping part of the server's response
    @Input() status: string;    //Status the server comes back with

    constructor(private router: Router,
                public bsModalRef: BsModalRef) {
    }

    get location() {
        return window.location;
    }

    /**
     * Extracts the accession number from the server's response, taking into account whether the
     * study is new or not. The former will have its accession number added under the mapping section.
     * @returns {string} Accession number assigned to the submitted study
     */
    get accno(): string {
        if (this.mapping.length && this.mapping[0].hasOwnProperty('assigned') && this.mapping[0].assigned) {
            return this.mapping[0].assigned;
        } else {
            return this.log.subnodes[2].subnodes[0].subnodes[0].message.split(':')[1].trim();
        }
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
