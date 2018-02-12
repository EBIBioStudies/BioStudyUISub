import {Component, Input, ViewChild} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {SubmissionType} from "../shared/submission-type.model";

@Component({
    selector: 'subm-add-dialog',
    templateUrl: './subm-add.component.html'
})
export class SubmAddDialogComponent {
    private projectName: string = 'Default';
    private projectNames: string[] = [];

    @Input() onSubmit: Function;    //callback for submit action
    @ViewChild('bsModal')
    private modalDirective: ModalDirective;

    constructor () {
        this.projectNames = SubmissionType.listTmplNames();
    }

    /**
     * Renders the modal with default values.
     */
    show(): void {
        this.modalDirective.show();
    }

    /**
     * Closes the modal, clearing any validation messages.
     */
    hide(): void {
        this.modalDirective.hide();
    }

    /**
     * Handler for "onShown" event, triggered exactly after the modal has been fully revealed.
     */
    onShown(focusEl: HTMLElement): void {
        focusEl.focus();
    }

    /**
     * Handler for click events on "Cancel" button.
     */
    onCancel(): void {
        this.projectName = 'Default';
        //this.typeName.control.reset();
        this.hide();
    }
}