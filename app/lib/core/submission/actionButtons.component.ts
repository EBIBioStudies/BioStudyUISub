import {Component, Input} from '@angular/core';

@Component({
    selector: 'action-buttons',
    template: `
                           <button *ngIf="status !== 'MODIFIED'"
                                    type="button" class="btn btn-danger btn-xs btn-flat"
                                    (click)="deleteSubmission()"
                                    tooltip="delete">
                                <i class="fa fa-trash-o fa-fw"></i>
                           </button>
                           <button *ngIf="status === 'MODIFIED'" 
                                    type="button" class="btn btn-warning btn-xs btn-flat"
                                    (click)="revertSubmission()"
                                    tooltip="undo changes">
                                <i class="fa fa-undo fa-fw"></i>
                           </button>
                           <button type="button" class="btn btn-primary btn-xs btn-flat"
                                    (click)="editSubmission()"
                                    tooltip="edit">
                                <i class="fa fa-pencil fa-fw"></i>
                           </button>
                           <button *ngIf="status === 'MODIFIED'" 
                                    type="button" class="btn btn-info btn-xs btn-flat"
                                    (click)="viewSubmission()"
                                    tooltip="view">
                                <i class="fa fa-eye fa-fw"></i>
                           </button>
`
})
export class ActionButtonsComponent {
    @Input() status:string;
}


