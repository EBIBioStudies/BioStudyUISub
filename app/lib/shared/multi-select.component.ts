import {Component, ViewChild, Input, OnInit, Pipe, PipeTransform, ElementRef} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

import * as _ from 'lodash';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any, filter: any): any {
        const fltr = _.reduce(filter, (acc, value, key) => {
            acc[key] = value === '' ? '' : new RegExp(value, 'gi');
            return acc;
        }, {});

        return _.filter(items, (item) =>
            _.reduce(fltr, (acc, regexp, key) => acc && (fltr[key] === '' || fltr[key].test(item[key])), true)
        );
    }
}

@Component({
    selector: 'multi-select',
    template: `
<div class="btn-group btn-block" dropdown>
    <label class="btn btn-default col-sm-10 dropdown-toggle" style="text-align:left">
        {{placeholder}}
    </label>
    <label class="btn btn-default col-sm-2 dropdown-toggle" (click)="onToggle()">
        <span class="caret"></span>
    </label>
    <ul dropdownMenu class="dropdown-menu" role="menu" [ngStyle]="{display:isOpen ? 'block' : 'none'}">
        <li *ngIf="filterEnabled" role="menuitem">
            <div class="form-group filter">
                <input class="form-control" 
                       type="text" 
                       [value]="filterText" 
                       [placeholder]="filterPlaceholder" 
                       #filterInput/>
                <span class="fa fa-times-circle-o clear-filter" (click)="clearFilter()"></span>
            </div>
        </li>
        <li *ngFor="let item of items | filter:{label: filterText}" role="menuitem">
            <a (click)="select(item)" class="dropdown-item">
                <i class="fa fa-fw" [ngClass]="{'fa-check': item.checked, 'glyphicon-none': !item.checked}"></i>
                <span [innerHtml]="item.label"></span>
            </a>
        </li>
    </ul>
</div>
`,
    styles: [`
:host {
    display: block;
}
`, `
.filter {
    padding: 5px; 
}
.clear-filter  {
    cursor: pointer;
    pointer-events: all;
    position: absolute;
    top: 10px;
    right: 0;
    z-index: 2;
    display: block;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
}
.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
`
    ]
})
export class MultiSelectComponent {
    @Input() placeholder: string = 'Select...';
    @Input() filterPlaceholder: string = 'Filter...';
    @Input() filterEnabled: boolean = true;

    private filterText: string = '';
    private isOpen: boolean = false;

    @ViewChild('filterInput') private filterInput: ElementRef;

    private items: any[] = [
        {checked: false, label: 'One'},
        {checked: false, label: 'Two'},
        {checked: true, label: 'Three'},
        {checked: false, label: 'Four'},
        {checked: false, label: 'Five'},
        {checked: true, label: 'Six'},
        {checked: false, label: 'Seven'},
        {checked: true, label: 'Eight'},
        {checked: false, label: 'Nine'},
        {checked: true, label: 'Ten'}
    ];

    ngAfterViewInit() {
        Observable
            .fromEvent(this.filterInput.nativeElement, 'keyup')
            .map(ev => ev.target.value)
            .debounceTime(200)
            .distinctUntilChanged()
            .subscribe(term => {
                this.filterText = term;
                //this.changeDetectorRef.markForCheck();
            });
    }


    private select(item: any) {
        item.checked = !item.checked;
    }

    private onToggle(): void {
        this.isOpen = !this.isOpen;
    }


}