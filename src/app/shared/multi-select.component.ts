import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    Pipe,
    PipeTransform,
    forwardRef,
    OnChanges
} from '@angular/core';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

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
<div class="btn-group btn-block" dropdown [isOpen]="isOpen">
    <button type="button" class="btn btn-default col-sm-12 dropdown-toggle" (click)="onToggle()">
        <span class="pull-left">{{placeholder}}</span>
        <span class="pull-right">
            <span class="caret"></span>
        </span>
    </button>
    <ul *dropdownMenu class="dropdown-menu" role="menu">
        <li [hidden]="empty || !filterEnabled" role="menuitem">
            <div class="form-group filter">
                <input class="form-control" 
                       type="text" 
                       [value]="filterText" 
                       [placeholder]="filterPlaceholder"
                       (input)="filterInputValue$.next(filterInput.value)"
                       #filterInput/>
                <span class="fa fa-times-circle-o clear-filter" (click)="onClearFilter()"></span>
            </div>
        </li>
        <li *ngIf="empty">
            <a class="dropdown-item"><span>No options to select from</span></a>
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
export class MultiSelectComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {
    @Input() placeholder = 'Select an option';
    @Input() filterPlaceholder = 'Filter list';
    @Input() filterEnabled = true;
    @Input() options: string[] = [];

    filterText = '';
    isOpen = false;
    items: any[] = [];

    filterInputValue$: Subject<string> = new Subject<string>();

    private selected: string[] = [];
    private sb: Subscription;

    ngOnInit(): void {
        this.sb = this.filterInputValue$.subscribe(term => {
            this.filterText = term;
        })
    }

    ngOnDestroy(): void {
        this.sb.unsubscribe();
    }

    ngOnChanges(): void {
        this.items = this.options.map(opt => ({checked: false, label: opt}));
        this.selected = [];
        this.onChange(this.selected);
    }

    get empty(): boolean {
        return this.options.length === 0;
    }

    onClearFilter() {
        this.filterText = '';
    }

    onToggle(): void {
        this.isOpen = !this.isOpen;
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
    writeValue(obj: any): void {
        if (obj && _.isArray(obj)) {
            this.setSelected(obj as string[]);
        }
    }

    // ControlValueAccessor interface
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // ControlValueAccessor interface
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // ControlValueAccessor interface
    setDisabledState(isDisabled: boolean): void {
        // not supported yet
    }
}
