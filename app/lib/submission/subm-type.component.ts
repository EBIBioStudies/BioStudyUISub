import {Component, Inject, Input, Output, OnInit, EventEmitter} from '@angular/core';

import * as _ from 'lodash';

const MODIFIED = 'MODIFIED';
const SUBMITTED = 'SUBMITTED';

const SUBM_TYPES = [
    {id: MODIFIED, name: 'New / Modified'},
    {id: SUBMITTED, name: 'Submitted'}
];

@Component({
    selector: 'subm-type',
    template: `
    <div class="btn-group" dropdown>
         <button id="single-button" type="button" class="btn btn-info" dropdownToggle>
            {{submType}} <span class="caret"></span>
         </button>
         <ul dropdownMenu role="menu" aria-labelledby="single-button">
             <li *ngFor="let type of submTypes"> 
                 <a class="dropdown-item" href="#" (click)="onSelect(type.id)">{{type.name}}</a>
             </li>
         </ul>
    </div>
`
})
export class SubmTypeComponent implements OnInit {
    @Output() select: EventEmitter = new EventEmitter();
    @Input() submitted?: boolean = false;

    private stype:string;

    ngOnInit() {
        this.stype = this.submitted ? SUBMITTED : MODIFIED;
    }

    private get submTypes() {
        return  SUBM_TYPES;
    }

    private get submType() {
        return _.find(SUBM_TYPES, {id:this.stype}).name;
    }

    private onSelect(type) {
        if (this.stype != type) {
            this.stype = type;
            this.select.emit({submitted: type === SUBMITTED});
        }
    }
}