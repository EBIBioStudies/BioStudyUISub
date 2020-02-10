import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Pipe,
  PipeTransform,
  forwardRef,
  OnChanges,
  ElementRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
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
      _.reduce(fltr, (acc, _regexp, key) => acc && (fltr[key] === '' || fltr[key].test(item[key])), true)
    );
  }
}

// TODO: is this component used?

@Component({
  selector: 'st-multi-select',
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
    }`
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MultiSelectComponent), multi: true}
  ]
})
export class MultiSelectComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {
  @Input() filterEnabled = true;
  filterInputValue$: Subject<string> = new Subject<string>();
  @Input() filterPlaceholder = 'Filter list';
  filterText = '';
  isOpen = false;
  items: any[] = [];
  @Input() options: string[] = [];
  @Input() placeholder = 'Select an option';

  private sb?: Subscription;
  private selected: string[] = [];

  constructor(private rootEl: ElementRef) {}

  get empty(): boolean {
    return this.options.length === 0;
  }

  get value(): any {
    return this.selected;
  }

  /**
   * Handler for click events. Closes the select box if left open.
   * @param {Event} event - DOM object for the click event.
   */
  closeOnClick(event: Event) {
    if (!this.rootEl.nativeElement.contains(event.target) && this.isOpen) {
      this.onToggle();
    }
  }

  ngOnChanges(): void {
    this.items = this.options.map(opt => ({ checked: false, label: opt }));
    this.selected = [];
    this.onChange(this.selected);
  }

  ngOnDestroy(): void {
    this.sb!.unsubscribe();
    document.body.removeEventListener('click', this.closeOnClick);
  }

  ngOnInit(): void {
    this.sb = this.filterInputValue$.subscribe(term => {
      this.filterText = term;
    });

    // Detects clicks outside the multi-select box.
    document.body.addEventListener('click', this.closeOnClick.bind(this));
  }

  onClearFilter() {
    this.filterText = '';
  }

  onToggle(): void {
    this.isOpen = !this.isOpen;
  }

  // ControlValueAccessor interface
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // ControlValueAccessor interface
  registerOnTouched() {}

  // ControlValueAccessor interface
  setDisabledState(): void {
    // not supported yet
  }

  // ControlValueAccessor interface
  writeValue(obj: any): void {
    if (obj && _.isArray(obj)) {
      this.setSelected(obj as string[]);
    }
  }

  private onChange: any = () => { };

  private setSelected(value: string[]): void {
    this.selected = value;
    const ht = _.zipObject(value, _.fill(Array(value.length), 1));
    _.forEach(this.items, item => {
      item.checked = (ht[item.label] === 1);
    });
  }
}
