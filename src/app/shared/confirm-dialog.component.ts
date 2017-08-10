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
    private buttonClicks: Subject<boolean> = new Subject<boolean>();

    @ViewChild('staticModal')
    private modalDirective: ModalDirective;

    @Input() title: string = 'Confirm';          //Summary text for the modal's title
    @Input() confirmLabel: string = 'Ok';        //Default name for positive action
    @Input() abortLabel: string = 'Cancel';      //Default name for negative action
    @Input() body: string = 'Are you sure?';     //Descriptive message for the modal's body

    confirm(message: string): Observable<any> {
        this.body = message;
        this.modalDirective.show();
        return this.buttonClicks
            .asObservable()
            .take(1)
            .filter(x => x)
            .map(x => {
            });
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