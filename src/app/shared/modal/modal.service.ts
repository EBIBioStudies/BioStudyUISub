import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class ModalService {
  constructor(private modalService: BsModalService) {}

  alert(
    text: string,
    title: string,
    confirmLabel: string,
    maxContentHeight?: string,
    config?: ModalOptions | undefined
  ): Observable<boolean> {
    const subj = new Subject<boolean>();
    this.modalService.show(ConfirmDialogComponent, {
      ...config,
      initialState: {
        title,
        confirmLabel,
        body: text,
        isHideCancel: true,
        maxContentHeight,
        callback: (value: boolean) => subj.next(value)
      }
    });

    return subj.asObservable().pipe(take(1));
  }

  confirm(text: string, title: string, confirmLabel: string, config?: ModalOptions | undefined): Observable<boolean> {
    const subj = new Subject<boolean>();
    this.modalService.show(ConfirmDialogComponent, {
      ...config,
      initialState: {
        title,
        confirmLabel,
        body: text,
        isHideCancel: false,
        callback: (value: boolean) => subj.next(value)
      }
    });

    return subj.asObservable().pipe(take(1));
  }

  whenConfirmed(text: string, title: string, confirmLabel: string): Observable<boolean> {
    return this.confirm(text, title, confirmLabel).pipe(filter((v) => v === true));
  }
}
