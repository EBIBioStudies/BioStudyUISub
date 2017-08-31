import {
    Component,
    ViewChild,
    Input
} from '@angular/core';

import {ModalDirective} from 'ngx-bootstrap/modal';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/take';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
    private buttonClicks: Subject<boolean>;

    @ViewChild('staticModal')
    private modalDirective: ModalDirective;

    @Input() title: string = 'Confirm';          //Summary text for the modal's title
    @Input() confirmLabel: string = 'Ok';        //Default name for positive action
    @Input() abortLabel: string = 'Cancel';      //Default name for negative action
    @Input() body: string = 'Are you sure?';     //Descriptive message for the modal's body

    /**
     * Renders the confirmation modal, allowing subscription to button events.
     * @param {string} [message] - Optional text for the modal's body section.
     * @param {boolean} [isDiscardCancel] - Optional RxJS stream behaviour. By default,
     * events are assumed to come from the confirmation button exclusively.
     * @returns {Observable<any>} Stream of button events.
     */
    confirm(message: string = this.body, isDiscardCancel: boolean = true): Observable<any> {
        let observable;

        //Initialises the stream of button events.
        //NOTE: Since the observable is created every time the modal is rendered,
        //it must be initialised to avoid a cumulative effect on subscriptions.
        this.buttonClicks = new Subject<boolean>();
        observable = this.buttonClicks.asObservable();

        //Renders the modal
        this.body = message;
        this.modalDirective.show();

        //Discards anything that returns false if required
        if (isDiscardCancel) {
            return observable.take(1).filter(x => x).map(x => {});
        } else {
            return observable;
        }
    }

    ok(): void {
        this.buttonClicks.next(true);
        this.modalDirective.hide();
    }

    cancel(): void {
        this.buttonClicks.next(false);
        this.modalDirective.hide();
    }
}