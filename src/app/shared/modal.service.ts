import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BsModalService} from 'ngx-bootstrap';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class ModalService {

    constructor( private modalService: BsModalService) {}
    confirm(text: string, title: string, confirmLabel: string): Observable<boolean> {
        const subj = new Subject<boolean>();
        this.modalService.show(ConfirmDialogComponent,
            {
                initialState: {
                    title: title,
                    confirmLabel: confirmLabel,
                    body: text,
                    isHideCancel: false,
                    callback: (value: boolean) => subj.next(value)
                }
            });
        return subj.asObservable().pipe(take(1));
    }

    whenConfirmed(text: string, title: string, confirmLabel: string): Observable<boolean> {
        return this.confirm(text, title, confirmLabel).pipe(filter(v => v === true));
    }

    alert(text: string, title: string, confirmLabel: string): Observable<boolean> {
        const subj = new Subject<boolean>();
        this.modalService.show(ConfirmDialogComponent,
            {
                initialState: {
                    title: title,
                    confirmLabel: confirmLabel,
                    body: text,
                    isHideCancel: true,
                    callback: (value: boolean) => subj.next(value)
                }
            });
        return subj.asObservable().pipe(take(1));
    }
}
