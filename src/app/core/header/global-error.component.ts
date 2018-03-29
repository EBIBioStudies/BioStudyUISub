import {
    ErrorHandler,
    NgZone,
    Component, ElementRef
} from '@angular/core';

import {GlobalErrorHandler} from 'app/global-error.handler';

@Component({
    selector: 'global-error',
    templateUrl: './global-error.component.html',
    styleUrls: ['./global-error.component.css']
})
export class GlobalErrorComponent {
    error = '';

    /**
     * Captures async errors and refreshes the UI (shows an alert) in sync with Angular's change detection mechanism.
     * @param {ErrorHandler} geh - Global handler for errors.
     * @param {NgZone} zone - Global forked zone.
     */
    constructor (geh: ErrorHandler, zone: NgZone, rootEl: ElementRef) {
        if (geh instanceof GlobalErrorHandler) {
            geh.anErrorDetected$.subscribe(error => {
                zone.run(() => {
                    this.error = this.message(error);
                    setTimeout(() => {
                        rootEl.nativeElement.firstChild.classList.add('slide-in');
                    });
                });
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
}