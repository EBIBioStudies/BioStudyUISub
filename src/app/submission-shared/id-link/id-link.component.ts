import {
    AfterViewInit,
    Component,
    forwardRef,
    Injector,
    Input,
    Output,
    ViewChild,
    EventEmitter
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, NgModel, Validators} from '@angular/forms';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/interval';

import {IdLinkModel} from './id-link.model';
import {IdLinkService} from './id-link.service';
import {IdLinkValue} from './id-link.value';
import {IdLinkValueValidatorDirective} from "./id-link.validator.directive";

@Component({
  selector: 'id-link',
  templateUrl: './id-link.component.html',
  styleUrls: ['./id-link.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdLinkComponent),
      multi: true
    }
  ]
})
export class IdLinkComponent implements AfterViewInit, ControlValueAccessor {
    private onChange: any = (_: any) => {};        //placeholder for handler propagating changes outside the custom control
    private onTouched: any = () => {};             //placeholder for handler after the control has been "touched"
    private linkModel: IdLinkModel = new IdLinkModel();
    private inputChanged: Subject<string> = new Subject<string>();

    @Input() placeholder = 'URL or prefix:ID';
    @Input() disabled = false;
    @Input() required?: boolean = false;
    @Input() readonly?: boolean = false;
    @Input() isSmall: boolean = true;              //flag for making the input area the same size as grid fields
    @Input() suggestLength: number = 30;           //max number of suggested values to be displayed at once
    @Input() suggestThreshold: number = 0;         //number of typed characters before suggestions are displayed.

    @ViewChild(NgModel)
    private inputModel: NgModel;

    @ViewChild(IdLinkValueValidatorDirective)
    private validator: IdLinkValueValidatorDirective;

    @Output() selected: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Instantiates a new custom input component. Validates the input's contents on debounced keypresses.
     * @param {IdLinkService} linkService - Singleton API service for Identifier.org.
     * @param {Injector} injector - Parent's injector retrieved to get the component's form control later on.
     * @param {DomSanitizer} sanitizer - Marks URLs as safe for use in the different DOM contexts.
     */
    constructor(public linkService: IdLinkService, private injector: Injector, private sanitizer: DomSanitizer) {
        this.inputChanged.debounceTime(300).distinctUntilChanged().subscribe(value => {
            this.update(value);
        });
    }

    set value(value: IdLinkValue) {
        if (this.linkModel.asValue().asString() !== value.asString()) {
            this.update(value.asString());
        }
    }

    get value(): IdLinkValue {
        return this.linkModel.asValue();
    }

    get inputText(): string {
        return this.linkModel.asString();
    }

    /**
     * Determines if a link is not a conventional URL.
     * @returns {boolean} True if pointing to Identifier's website.
     */
    get isIdLink(): boolean {
        return this.validator.extra.isId;
    }

    /**
     * Web link for the current URL or prefix:id pointer if valid, sanitised if so wished.
     * @param {boolean} [isSanitise = false] - Enables protection against XSS if necessary.
     * @returns {SafeUrl | string} Sanitised URL for the link corresponding to the field's current contents.
     */
    link(isSanitise: boolean = false): SafeUrl | string {
        let url = this.validator.extra.url;

        if (isSanitise) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(url);
        } else {
            return url;
        }
    }

    /**
     * Writes a new value from the form model into the view or (if needed) DOM property. It supports both
     * plain input from the server (a string) or directly an object model for the link.
     * @see {@link ControlValueAccessor}
     * @param {string | IdLinkValue} newValue - Value to be stored.
     */
    writeValue(newValue: string | IdLinkValue): void {
        if (typeof newValue === 'string') {
            this.update(newValue);
        } else if (newValue && newValue instanceof IdLinkValue) {
            this.value = newValue;
        }
    }

    /**
     * Registers a handler that should be called when something in the view has changed.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler telling other form directives and form controls to update their values.
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }


    /**
     * Registers a handler specifically for when a control receives a touch event.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler for touch events.
     */
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }

    /**
     * Lifecycle hook for operations after all child views have been initialised. It merges all validators of
     * the actual input and the wrapping component.
     * NOTE: This stage is not testable. Hence the try-catch block.
     */
    ngAfterViewInit() {
        try {
            const control = this.injector.get(NgControl).control;

            control.setValidators(Validators.compose([control.validator, this.inputModel.control.validator]));
            control.setAsyncValidators(Validators.composeAsync([control.asyncValidator, this.inputModel.control.asyncValidator]));
        } catch (event) {
            console.log('Validator merge bypassed. ' + event);
        }
    }

    /**
     * Handler for the input event. Notifies the input's contents change.
     * @param {Event} event - DOM event object.
     */
    onInput(event: Event) {
        this.inputChanged.next((<HTMLInputElement>event.target).value);
    }

    /**
     * Handler for typeahead selection events. Replaces the present prefix with the one selected and notifies the
     * outside world of the selection.
     * @param {string} selection - Selected prefix.
     */
    onSelect(selection: string) {
        if (this.linkModel.id) {
            this.update(selection + ':' + this.linkModel.id);
        } else {
            this.update(selection + ':');
        }
        this.selected.emit(selection);

        //Forces the control's "viewModel" and "value" to update on selection, not later.
        this.inputModel.reset(this.linkModel.asString());
    }

    /**
     * Updates the link model, notifying the outside world.
     * @param {string} value - New value for the link model.
     * @param {boolean} [prefixOnly = false] - No clear purpose.
     * TODO: what is the exact purpose of prefixOnly (beyond idlink.model's corresponding code) and is it still necessary?
     */
    private update(value: string, prefixOnly = false) {
        this.linkModel.update(value, prefixOnly);
        this.onChange(value);
    }
}
