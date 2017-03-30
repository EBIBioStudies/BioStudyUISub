import {Component, ViewChild} from '@angular/core';
import {ModalDirective} from 'ng2-bootstrap/modal';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'confirm-dialog',
    template: `
<div class="modal fade" bsModal #staticModal="bs-modal" 
     [config]="{backdrop: 'static'}"
     tabindex="-1" 
     role="dialog">

    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header alert-warning">
                <!--button type="button" class="close pull-right" aria-label="Close" (click)="no()">
                    <span aria-hidden="true">&times;</span>
                </button-->
                <div class="media">
                    <span class="media-left">
                        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    </span>
                    <div class="media-body">
                        <p class="media-heading">{{message}}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="pull-right">
                    <button type="button" class="btn btn-primary btn-xs" (click)="yes()">Yes</button>
                    <button type="button" class="btn btn-default btn-xs" (click)="no()">No</button>                
                </div>
            </div>  
        </div>
    </div>
    
</div>         
    `
})

export class ConfirmDialogComponent {

    @ViewChild('staticModal') private modalDirective: ModalDirective;

    private message: string = '';

    private buttonClicks: Subject<boolean> = new Subject<boolean>();

    confirm(message: string): Observable<any> {
        this.message = message;
        this.modalDirective.show();
        return Observable.create(observer => {
            this.buttonClicks.asObservable().subscribe(value => {
                if (value === true) {
                    observer.next({});
                }
                observer.complete();
            });
            return () => {
            };
        });
    }

    private yes(): void {
        this.buttonClicks.next(true);
        this.modalDirective.hide();
    }

    private no(): void {
        this.buttonClicks.next(false);
        this.modalDirective.hide();
    }
}