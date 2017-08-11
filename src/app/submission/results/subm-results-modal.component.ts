import {Component, Input} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    selector: 'subm-results',
    templateUrl: './subm-results-modal.component.html'
})
export class SubmResultsModalComponent {
    @Input() log: any;
    @Input() status: string;
    constructor(public bsModalRef: BsModalRef) {
    }
}
