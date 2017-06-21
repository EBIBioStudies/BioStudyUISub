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
import {Column} from "ag-grid";

@Component({
    selector: 'feature-column',
    templateUrl: './feature-column.component.html',
    styles: [
        ` 
 .frame {
    width:100%;
    height:100%;
    position:relative;
    border-bottom: 1px solid white;
 }
 
 .pointer {
    cursor:pointer;
 }
 
 .frame span {
     position:absolute;
     top:25%;
     left:0;
 }
 
 .frame .icons {
    position:absolute;
    display: none;
    right:5px;
    top:5px;
    color:#cccccc
 }
 
 .frame:hover {
    border-color: #cccccc;
 }
 
 .frame:hover .icons {
    display: block;
 }
`
    ],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FeatureColumnComponent), multi: true}
    ]
})
export class FeatureColumnComponent implements AfterViewInit, ControlValueAccessor {
    @Input() column: Column;
    @Input() required?: boolean = false;
    @Output() remove: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren('inputBox') private inputBoxQuery: QueryList<ElementRef>;

    editMode: boolean = false;

    ngAfterViewInit(): void {
        this.inputBoxQuery.changes.subscribe((list: QueryList <ElementRef>) => {
            if (list.length > 0) {
                let inpBox = list.first;
                inpBox.nativeElement.focus();
            }
        });
    }

    writeValue(obj: any): void {
    }

    registerOnChange(fn: any): void {
    }

    registerOnTouched(fn: any): void {
    }


    private get canEdit(): boolean {
        return !this.required;
    }

    private editModeOn(): void {
        this.editMode = true;
    }

    private editModeOff(): void {
        this.editMode = false;
    }

    private onEditIconClick(ev): void {
        this.editModeOn();
    }

    private onRemoveIconClick(ev): void {
        this.remove.emit();
    }

    private onEditBoxBlur(ev): void {
        this.editModeOff();
    }

    private onEditBoxKeyUp(ev): void {
        let code = ev.target.code;
        if (code === 13) {
            this.editModeOff();
        }
    }
}