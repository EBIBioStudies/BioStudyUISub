import {Inject, ErrorHandler, NgZone, Component} from '@angular/core';
import {GlobalErrorHandler} from '../../global-error.handler';

@Component({
    selector: 'global-error',
    template: `
        <div *ngFor="let error of errors" style="position:absolute;width:100%;z-index:1000">
            <alert type="danger" dismissible="true">
                {{error.name}} {{error.message}}
            </alert>
        </div>
    `
})

export class GlobalErrorComponent {
    private errors = [];

    constructor(@Inject(ErrorHandler) geh: ErrorHandler,
                @Inject(NgZone) zone: NgZone) {
        if (geh instanceof GlobalErrorHandler) {
            geh.anErrorDetected$.subscribe(error => {
                zone.run(() => {
                    this.errors = [error];
                });
            });
        }
    }
}