import {Component, Input, ViewChild} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";

@Component({
    selector: 'subm-add-dialog',
    templateUrl: './subm-add.component.html'
})
export class SubmAddDialogComponent {
    public projectName: string = 'Default';

    @Input() onSubmit?: Function;            //callback for submit action
    @Input() projectNames?: string[] = [];   //names of projects with templates
    @ViewChild('bsModal')
    private modalDirective?: ModalDirective;

    /**
     * Renders the modal with default values.
     */
    show(): void {
        this.modalDirective!.show();
    }

    /**
     * Closes the modal, clearing any validation messages.
     */
    hide(): void {
        this.modalDirective!.hide();
    }

    /**
     * Handler for "onShown" event, triggered exactly after the modal has been fully revealed.
     * It sets focus on the first radio button for project selection.
     */
    onShown(): void {
        (<HTMLInputElement>document.getElementsByClassName('project-radio')[0]).focus();
    }

    /**
     * Handler for click events on "Cancel" button.
     */
    onCancel(): void {
        this.projectName = 'Default';
        this.hide();
    }
}