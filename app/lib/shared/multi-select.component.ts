import {
    Component,
    ViewChild,
    Input,
    OnInit,
    Pipe,
    PipeTransform,
    ElementRef,
    forwardRef,
    OnChanges
} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

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
    ],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MultiSelectComponent), multi: true}
    ]
})
export class MultiSelectComponent implements ControlValueAccessor, OnChanges{
    @Input() placeholder: string = 'Select...';
    @Input() filterPlaceholder: string = 'Filter...';
    @Input() filterEnabled: boolean = true;
    @Input() options: string[];

    private filterText: string = '';
    private isOpen: boolean = false;

    @ViewChild('filterInput') private filterInput: ElementRef;

    private items: any[] = [];

    private selected: string[] = [];

    ngOnChanges(): void {
        this.items  = _.map(this.options, opt => ({checked: false, label: opt}));
        this.selected = [];
        this.onChange(this.selected);
    }

    ngAfterViewInit() {
        Observable
            .fromEvent(this.filterInput.nativeElement, 'keyup')
            .map(ev => ev.target.value)
            .debounceTime(200)
            .distinctUntilChanged()
            .subscribe(term => {
                this.filterText = term;
            });
    }

    private select(item: any) {
        item.checked = !item.checked;
        if (item.checked) {
            this.selected.push(item.label);
        } else {
            _.remove(this.selected, el => (el === item.label));
        }
        this.onChange(this.selected);
    }

    private onToggle(): void {
        this.isOpen = !this.isOpen;
    }

    private setSelected(value: string[]): void {
        this.selected = value;
        const ht = _.zipObject(value, _.fill(Array(value.length), 1));
        _.forEach(this.items, item => {
           item.checked = (ht[item.label] == 1);
        });
    }

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };

    get value(): any {
        return this.selected;
    }

    // ControlValueAccessor interface
    writeValue(obj: any) : void {
        if (obj && _.isArray(obj)) {
            this.setSelected(obj as string[]);
        }
    }

    // ControlValueAccessor interface
    registerOnChange(fn: any) : void {
        this.onChange = fn;
    }

    // ControlValueAccessor interface
    registerOnTouched(fn: any) : void {
        this.onTouched = fn;
    }

    // ControlValueAccessor interface
    setDisabledState(isDisabled: boolean) : void {
       // not supported yet
    }

}