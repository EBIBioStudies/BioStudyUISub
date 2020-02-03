import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Option } from 'fp-ts/lib/Option';
import { ServerError } from 'app/shared/server-error.handler';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SectionForm } from '../shared/model/section-form.model';
import { SubmEditService } from '../shared/subm-edit.service';
import { CustomFormControl } from '../shared/model/custom-form-control.model';

type FormControlGroup = Array<FormControl>;

@Component({
  selector: 'st-subm-sidebar',
  templateUrl: './subm-sidebar.component.html',
  styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSidebarComponent implements OnDestroy {
  @Input() collapsed?: boolean = false;
  invalidControls: FormControlGroup[] = [];
  isCheckTabActive: boolean = true;
  @Input() sectionForm?: SectionForm;
  serverError?: ServerError;
  showAdvanced: boolean = false;
  @Output() toggle = new EventEmitter();

  private controls: Array<FormControl>[] = [];
  private unsubscribe = new Subject<void>();
  private unsubscribeForm = new Subject<void>();

  constructor(private submEditService: SubmEditService) {
    this.submEditService.serverError$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((error) => {
        if (error.log !== undefined) {
          this.serverError = ServerError.fromResponse(error.log);
        } else {
          this.serverError = ServerError.fromResponse(error);
        }
      });

    this.submEditService.sectionSwitch$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(sectionForm => this.switchSection(sectionForm));
  }

  get isEditTabActive(): boolean {
    return !this.isCheckTabActive;
  }

  get numInvalid(): number {
    return this.invalidControls.flatMap(c => c).length;
  }

  get numInvalidAndTouched(): number {
    return this.invalidControls.flatMap(c => c).filter(c => c.touched).length;
  }

  ngOnDestroy(): void {
    this.unsubscribeForm.next();
    this.unsubscribeForm.complete();

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onAddTabClick(): void {
    this.isCheckTabActive = false;
  }

  onCheckTabClick(): void {
    this.isCheckTabActive = true;
  }

  /**
   * Handler for the button toggling the collapsed state of the whole sidebar menu,
   * bubbling the menu's state up.
   * @param {Event} [event] - Optional click event object.
   */
  onToggleCollapse(event?: Event): void {
    // tslint:disable-next-line: no-unused-expression
    event && event.preventDefault();

    if (this.toggle) {
      this.toggle.emit();
    }
  }

  private groupControlsBySectionId(controls: FormControl[]): FormControlGroup[] {
    return controls
      .reduce((rv, c) => {
        const group = rv.isEmpty() ? undefined : rv[rv.length - 1];
        const prevControl = group === undefined ? undefined : group[group.length - 1];
        if (prevControl !== undefined && CustomFormControl.compareBySectionId(prevControl, c) === 0) {
          group!.push(c);
        } else {
          rv.push([c]);
        }
        return rv;
      }, [] as Array<FormControlGroup>);
  }

  private switchSection(sectionFormOp: Option<SectionForm>) {
    if (sectionFormOp.isSome()) {
      const secForm = sectionFormOp.toUndefined()!;
      if (!secForm.isRootSection) {
        return;
      }

      this.unsubscribeForm.next();

      secForm.structureChanges$
        .pipe(takeUntil(this.unsubscribeForm))
        .subscribe(() => {
          this.controls = this.groupControlsBySectionId(secForm.controls());
          this.updateInvalidControls();
        });

      secForm.form.statusChanges
      .pipe(takeUntil(this.unsubscribeForm))
      .subscribe(() => {
        this.updateInvalidControls();
      });
    }
  }

  private updateInvalidControls() {
    this.invalidControls = this.controls.map(g => g.filter(c => c.invalid)).filter(g => !g.isEmpty());
  }
}
