import {
    ErrorHandler,
    Component,
    ElementRef, ChangeDetectorRef
} from '@angular/core';

import {GlobalErrorHandler} from 'app/global-error.handler';

@Component({
    selector: 'global-error',
    templateUrl: './global-error.component.html',
    styleUrls: ['./global-error.component.css']
})
export class GlobalErrorComponent {
    error: string = '';

    /**
     * Captures async errors and refreshes the UI (slides an alert in).
     * @param {ErrorHandler} geh - Global handler for errors.
     * @param {ChangeDetectorRef} changeRef - Forces change detection on this component.
     * @param {ElementRef} rootEl - Reference to the root element of the component's template.
     */
    constructor (geh: ErrorHandler, changeRef: ChangeDetectorRef, private rootEl: ElementRef) {
        if (geh instanceof GlobalErrorHandler) {
            geh.anErrorDetected$.subscribe(error => {
                this.error = this.message(error);
                changeRef.detectChanges();
                rootEl.nativeElement.firstChild.classList.add('slide-in');
            });
        }
    }

    /**
     * Merges different error properties to produce the string to be shown as an error message.
     * @param error - Error object containing fragments of the error message.
     * @returns {string} - Text to be used as an error message.
     */
    message(error: any): string {
        const name = error.name || '';
        const message = error.message || '';
        return (name + message).length === 0 ? 'Unknown error' : (name + ' ' + message);
    }

    /**
     * Slides the alert out when closed.
     */
    onClose() {
        this.rootEl.nativeElement.firstChild.classList.remove('slide-in');
    }
}