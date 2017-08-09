import {
    Component,
    ViewChild
} from '@angular/core';

import {ModalDirective} from 'ngx-bootstrap/modal';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/take';

@Component({
    selector: 'confirm-dialog',
    template: `
<div class="modal fade" bsModal #staticModal="bs-modal" 
     [config]="{backdrop: 'static'}"
     tabindex="-1" 
     role="dialog">

    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">{{title}}</div>
            <div class="modal-body">
                <div class="media">
                    <span class="media-left">
                        <i aria-hidden="true" class="fa fa-exclamation-triangle"></i>
                    </span>
                    <div class="media-body">
                        <p class="media-heading">{{body}}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="pull-right">
                    <button type="button" class="btn btn-primary btn-xs" (click)="ok()">{{confirmLabel}}</button>
                    <button type="button" class="btn btn-default btn-xs" (click)="cancel()">{{abortLabel}}</button>                
                </div>
            </div>  
        </div>
    </div>
    
</div>         
    `
})
export class ConfirmDialogComponent {
    private buttonClicks: Subject<boolean> = new Subject<boolean>();

    @ViewChild('staticModal')
    private modalDirective: ModalDirective;

    title: string = 'Confirm';          //Summary text for the modal's title
    body: string = 'Are you sure?';     //Descriptive message for the modal's body
    confirmLabel: string = 'Ok';        //Default name for positive action
    abortLabel: string = 'Cancel';      //Default name for negative action

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