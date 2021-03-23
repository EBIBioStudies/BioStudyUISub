import { AfterViewInit, Component, forwardRef, Injector, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
  Validators,
  AbstractControl
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject, Observable } from 'rxjs';
import { IdLinkModel } from './id-link.model';
import { IdLinkService } from './id-link.service';
import { IdLinkValue } from './id-link.value';
import { IdLinkValueValidatorDirective } from './id-link.validator.directive';
import { mergeMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'st-id-link',
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
  dataSource!: Observable<any>;
  @Input() disabled = false;
  @Input() inputId: string = '';
  @Input() isSmall: boolean = true; // flag for making the input area the same size as grid fields
  @Input() placeholder = 'URL or prefix:ID';
  @Input() readonly?: boolean = false;
  @Input() required?: boolean = false;
  @Input() suggestLength: number = 10; // max number of suggested values to be displayed at once
  @Input() suggestThreshold: number = 0; // number of typed characters before suggestions are displayed.
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  private inputChanged: Subject<string> = new Subject<string>();
  @ViewChild(NgModel, { static: true })
  private inputModel!: NgModel;

  private linkModel: IdLinkModel = new IdLinkModel();

  @ViewChild(IdLinkValueValidatorDirective, { static: true })
  private validator?: IdLinkValueValidatorDirective;

  /**
   * Instantiates a new custom input component. Validates the input's contents on debounced keypresses.
   * @param linkService - Singleton API service for Identifier.org.
   * @param injector - Parent's injector retrieved to get the component's form control later on.
   * @param sanitizer - Marks URLs as safe for use in the different DOM contexts.
   */
  constructor(private linkService: IdLinkService, private injector: Injector, private sanitizer: DomSanitizer) {
    this.inputChanged.pipe(distinctUntilChanged()).subscribe((value) => this.update(value));

    this.dataSource = new Observable((observer: any) => {
      // Runs on every typing
      observer.next(this.inputText);
    }).pipe(
      mergeMap((value: string) => {
        const suggested = this.linkService.suggest(value);

        return suggested;
      })
    );
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
   * @returns True if pointing to Identifier's website.
   */
  get isIdLink(): boolean {
    if (this.validator) {
      return this.validator.state.isId;
    }

    return false;
  }

  /**
   * Web link for the current URL or prefix:id pointer if valid, sanitised if so wished.
   * @param [isSanitise = false] - Enables protection against XSS if necessary.
   * @returns Sanitised URL for the link corresponding to the field's current contents.
   */
  link(isSanitise: boolean = false): SafeUrl | string {
    let url = '';

    if (this.validator) {
      url = this.validator.state.url;
    }

    if (isSanitise) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return url;
    }
  }

  /**
   * Lifecycle hook for operations after all child views have been initialised. It merges all validators of
   * the actual input and the wrapping component.
   * NOTE: This stage is not testable. Hence the try-catch block.
   */
  ngAfterViewInit(): void {
    try {
      const control: AbstractControl | null = this.injector.get(NgControl).control;

      if (control) {
        control.setValidators(Validators.compose([control.validator, this.inputModel.control.validator]));
        control.setAsyncValidators(
          Validators.composeAsync([control.asyncValidator, this.inputModel.control.asyncValidator])
        );
      }
    } catch (event) {
      // TODO: Review logic and check if this try/catch is needed
    }
  }

  /**
   * Handler for the input event. Notifies the input's contents change.
   * @param event - DOM event object.
   */
  onInput(event: Event): void {
    this.inputChanged.next((event.target as HTMLInputElement).value);
  }

  /**
   * Handler for typeahead selection events. Replaces the present prefix with the one selected and notifies the
   * outside world of the selection.
   * @param selection - Selected prefix.
   */
  onSelect(selection: string): void {
    if (this.linkModel.id) {
      this.update(selection + ':' + this.linkModel.id);
    } else {
      this.update(selection + ':');
    }
    this.selected.emit(selection);

    // Forces the control's "viewModel" and "value" to update on selection, not later.
    this.inputModel.reset(this.linkModel.asString());
  }

  /**
   * Registers a handler that should be called when something in the view has changed.
   * @see {@link ControlValueAccessor}
   * @param fn - Handler telling other form directives and form controls to update their values.
   */
  registerOnChange(fn): void {
    this.onChange = fn;
  }

  /**
   * Registers a handler specifically for when a control receives a touch event.
   * @see {@link ControlValueAccessor}
   */
  registerOnTouched(): void {}

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  /**
   * Writes a new value from the form model into the view or (if needed) DOM property. It supports both
   * plain input from the server (a string) or directly an object model for the link.
   * @see {@link ControlValueAccessor}
   * @param newValue - Value to be stored.
   */
  writeValue(newValue: string | IdLinkValue): void {
    if (typeof newValue === 'string') {
      this.update(newValue);
    } else if (newValue && newValue instanceof IdLinkValue) {
      this.value = newValue;
    }
  }

  private onChange: any = (_: any) => {}; // placeholder for handler propagating changes outside the custom control

  /**
   * Updates the link model, notifying the outside world.
   * @param value - New value for the link model.
   * @param [prefixOnly = false] - No clear purpose.
   * TODO: what is the exact purpose of prefixOnly (beyond idlink.model's corresponding code) and is it still necessary?
   */
  private update(value: string, prefixOnly = false): void {
    this.linkModel.update(value, prefixOnly);
    this.onChange(value);
  }
}
