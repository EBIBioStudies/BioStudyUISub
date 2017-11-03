import {
    Component,
    ViewChild,
    ElementRef,
    Input,
    AfterViewInit
} from '@angular/core';

import {ModalDirective} from 'ngx-bootstrap';
import {AbstractControl, NgForm, NgModel} from "@angular/forms";

@Component({
    selector: 'subm-add-dialog',
    templateUrl: './subm-add.component.html'
})
export class SubmAddDialogComponent implements AfterViewInit {
    _type: string = 'Grid';      //form model member for the type property
    name: string;                //form model member for the name property
    isUnique: boolean = true;    //flag for the uniqueness of the chosen type name

    @Input() addType: Function = () => {};

    @ViewChild('focusBtn')
    private focusEl: ElementRef;
    @ViewChild('bsModal')
    private modalDirective: ModalDirective;
    @ViewChild('typeName')
    private typeName: NgModel;
    
    get type(): string {
        return this._type;
    }

    /**
     * Sets the type of the new type item. If it's a section, then the type name doesn't have to be unique.
     * @param {boolean} value Type of the new type item.
     */
    set type(value: string) {
        if (value == 'Section') {
            this.isUnique = true;
        }
        this._type = value;
    }

    show(): void {
        this.modalDirective.show();
    }

    hide(): void {
        this.modalDirective.hide();
    }

    /**
     * Every time the type name is blank, it will be marked as invalid (no existing type name is blank after all).
     */
    ngAfterViewInit() {
        this.typeName.statusChanges.subscribe((status) => {
            if (status == 'INVALID') {
                this.isUnique = true;
            }
        });
    }

    /**
     * Handler for "onShown" event, triggered exactly after the modal has been fully revealed.
     */
    onShown(): void {
        this.focusEl.nativeElement.focus();
    }

    onSubmit(form: NgForm): void {
        let isSingleRow: boolean = false;
        let isSection: boolean = false;

        //Adds type if all form fields completed satisfactorily
        if (form.valid && this.isUnique) {
            if (this._type == 'Section') {
                isSection = true;
            } else if (this._type == 'List') {
                isSingleRow = true;
            }

            //Add operation successful => gets form ready for further additions
            if (this.addType(this.name, isSection, isSingleRow)) {
                this.hide();
                form.reset();
                this.isUnique = true;
                this.type = 'Grid';

            //Add operation failed => type name was not unique => show error
            } else {
                this.isUnique = false;
            }

        //Triggers form-led validation of all fields.
        } else {
            this.typeName.control.markAsTouched({ onlySelf: true });
        }
    }
}