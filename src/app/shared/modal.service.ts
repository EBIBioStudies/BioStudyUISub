import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BsModalService} from 'ngx-bootstrap';
import {ConfirmDialogComponent} from './confirm-dialog.component';

@Injectable()
export class ModalService {

    constructor( private modalService: BsModalService) {}
    confirm(text: string, title: string, confirmLabel: string): Observable<boolean> {
        const subj = new Subject<boolean>();
        this.modalService.show(ConfirmDialogComponent,
            {
                initialState: {
                    headerTitle: title,
                    confirmLabel: confirmLabel,
                    body: text,
                    isDiscardCancel: false,
                    callback: (value: boolean) => subj.next(value)
                }
            });
        return subj.asObservable().take(1);
    }

    whenConfirmed(text: string, title: string, confirmLabel: string): Observable<boolean> {
        return this.confirm(text, title, confirmLabel).filter(v => v === true);
    }
}
