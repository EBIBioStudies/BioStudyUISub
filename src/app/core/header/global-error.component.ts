import {
    ErrorHandler,
    NgZone,
    Component
} from '@angular/core';

import {GlobalErrorHandler} from 'app/global-error.handler';

@Component({
    selector: 'global-error',
    template: `
        <div *ngFor="let error of errors" style="position:absolute;width:100%;z-index:1000">
            <alert type="danger" dismissible="true">
                {{message(error)}}
            </alert>
        </div>
    `
})

export class GlobalErrorComponent {
    errors = [];

    constructor(geh: ErrorHandler,
                zone: NgZone) {
        if (geh instanceof GlobalErrorHandler) {
            geh.anErrorDetected$.subscribe(error => {
                zone.run(() => {
                    this.errors = [error];
                });
            });
        }
    }

    message(error: any): string {
        const name = error.name || '';
        const message = error.message || '';
        return (name + message).length === 0 ? 'Oops! Something went wrong..' : (name + ' ' + message);
    }
}