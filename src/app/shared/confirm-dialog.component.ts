import {Component, ElementRef, Input, ViewChild} from '@angular/core';

import {BsModalRef, ModalDirective} from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/take';

/**
 * UI component for confirmation modals with all its text parts parameterised.
 */
@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
    @ViewChild('focusBtn')
    private focusEl?: ElementRef;

    @Input() title: string = 'Confirm';    //Summary text for the modal's title
    @Input() confirmLabel: string = 'Ok';               //Default name for positive action
    @Input() abortLabel: string = 'Cancel';             //Default name for negative action
    @Input() isHideCancel: boolean = false;             //Hides the cancel button. Suitable for info modals.
    @Input() body: string = 'Are you sure?';            //Descriptive message for the modal's body

    callback?: (v: boolean) => any;

    constructor(public bsModalRef: BsModalRef) {
    }

    /**
     * Handler for confirmation event. Notifies such confirmation with a "true" in the event stream.
     */
    ok(): void {
        this.response(true);
        this.bsModalRef.hide();
    }

    /**
     * Handler for abort event. Notifies such confirmation with a "false" in the event stream.
     */
    cancel(): void {
        this.response(false);
        this.bsModalRef.hide();
    }

    /**
     * Handler for "onShown" event, triggered exactly after the modal has been fully revealed.
     */
    onShown(): void {
        this.focusEl!.nativeElement.focus();
    }

    /**
     * Monitors modal dismissals and, if any of them are due to clicks on the backdrop area,
     * it is interpreted as a cancel action.
     * @param event - Custom modal event indicating the reason for the modal's dismissal
     */
    onHidden(event: ModalDirective): void {
        if (event.dismissReason == 'backdrop-click') {
            this.cancel();
        }
    }

    private response(resp: boolean): void {
        if (this.callback) {
            this.callback(resp);
        }
    }
}
