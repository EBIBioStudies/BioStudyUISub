import {
    Component,
    Input,
    Output,
    forwardRef,
    EventEmitter,
    ViewChildren,
    QueryList,
    ElementRef, AfterViewInit
} from '@angular/core';

import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Component({
    selector: 'inline-edit',
    templateUrl: './inline-edit.component.html',
    styles: [
        ` 
 .inline-edit-wrapper {
    width:100%;
    height:100%;
    position:relative;
    border-bottom: 1px solid white;
 }
 
 .inline-edit-wrapper span {
     position:absolute;
     top:25%;
     left:0;
 }
 
 .inline-edit-wrapper .icons {
    position:absolute;
    display: none;
    right:5px;
    top:5px;
    color:#cccccc
 }
 
 .inline-edit-wrapper:hover {
    border-color: #cccccc;
 }
 
 .inline-edit-wrapper:hover .icons {
    display: block;
 }
 
 .pointer {
    cursor:pointer;
 }
`
    ],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InlineEditComponent), multi: true}
    ]
})
export class InlineEditComponent implements AfterViewInit, ControlValueAccessor {
    @Input() required?: boolean = false;
    @Input() disabled?: boolean = false;
    @Input() emptyValue?: string = '';
    @Input() placeholder?: string = '';
    @Output() remove: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren('inlineEditBox') private inlineEditBoxQuery: QueryList<ElementRef>;

    editing: boolean = false;
    onChange: any = () => {
    };
    onTouched: any = () => {
    };

    private _value: string = '';

    ngAfterViewInit(): void {
        this.inlineEditBoxQuery.changes.subscribe((list: QueryList <ElementRef>) => {
            if (list.length > 0) {
                let inpBox = list.first;
                inpBox.nativeElement.focus();
            }
        });
    }

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    writeValue(value: any): void {
        this._value = value;
    }

    public registerOnChange(fn: () => {}): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    private get canEdit(): boolean {
        return !this.required;
    }

    private startEditing(): void {
        this.editing = true;
    }

    private stopEditing(): void {
        this.editing = false;
    }

    private onEditClick(ev): void {
        if (this.disabled) {
            return;
        }
        this.startEditing();
    }

    private onRemoveClick(ev): void {
        this.remove.emit();
    }

    private onEditBoxBlur(ev): void {
        this.stopEditing();
    }

    private onEditBoxKeyUp(ev: KeyboardEvent): void {
        if (ev.key === 'Enter') {
            this.stopEditing();
        }
    }
}