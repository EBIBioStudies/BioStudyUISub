import {
    Component,
    ViewChild,
    Output,
    EventEmitter
} from '@angular/core';

import {ModalDirective} from 'ngx-bootstrap';
import {SubmAddEvent} from './subm-add-event.model';

@Component({
    selector: 'subm-add-dialog',
    templateUrl: './subm-add.component.html'
})
export class SubmAddDialogComponent {
    itemType = 'AttributeGrid';
    name: string;

    @Output() okClick: EventEmitter<SubmAddEvent> = new EventEmitter();

    @ViewChild('bsModal')
    private modalDirective: ModalDirective;

    show(): void {
        this.modalDirective.show();
    }

    ok(): void {
        this.okClick.next(new SubmAddEvent(this.itemType, this.name || 'Test'));
    }
}