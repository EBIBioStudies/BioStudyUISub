import { Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isPtAttributeValueEmpty } from 'app/utils/validation.utils';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Org, OrgService } from './org.service';

interface OrgItem {
  name: string;
  rorid: string;
}

@Component({
  selector: 'st-org-input',
  templateUrl: './org-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrgInputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class OrgInputComponent implements ControlValueAccessor, OnInit {
  @Input() formControl!: FormControl;
  @Input() readonly: boolean = false;
  @Input() isInputGroup: boolean = false;
  @Input() multiple: boolean = false;
  orgs$: Observable<Org[]> | undefined;
  orgsLoading = false;
  orgsInput$ = new Subject<string>();
  selectedOrgs: Org | Org[] = [];

  constructor(private orgService: OrgService) {}

  ngOnInit(): void {
    this.loadOrgs();
  }

  onSelectChange(value: Org | Org[]): void {
    this.onChange(value);
  }

  writeValue(value: OrgItem | OrgItem[]): void {
    const filterEmptyValues = (collection) => collection.filter((item) => !isPtAttributeValueEmpty(item));
    const formattedValue = Array.isArray(value) ? filterEmptyValues(value) : value;

    if (!this.multiple && !Array.isArray(formattedValue) && !isPtAttributeValueEmpty(formattedValue)) {
      this.selectedOrgs = { id: formattedValue.rorid, name: formattedValue.name };
    }

    if (this.multiple && !Array.isArray(formattedValue) && !isPtAttributeValueEmpty(formattedValue)) {
      this.selectedOrgs = [{ id: formattedValue.rorid, name: formattedValue.name }];
    }

    if (this.multiple && Array.isArray(value) && formattedValue.length > 0) {
      this.selectedOrgs = formattedValue.map((orgItem: OrgItem) => ({ id: orgItem.rorid, name: orgItem.name }));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  trackByFn(org): string {
    return org.name;
  }

  // placeholder for handler propagating changes outside the custom control
  onChange: any = (_: any) => {};
  onTouched: any = (_: any) => {};

  private loadOrgs(): void {
    this.orgs$ = concat(
      of([]), // default items
      this.orgsInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.orgsLoading = true)),
        switchMap((term) =>
          this.orgService.getOrganizations(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.orgsLoading = false))
          )
        )
      )
    );
  }
}
