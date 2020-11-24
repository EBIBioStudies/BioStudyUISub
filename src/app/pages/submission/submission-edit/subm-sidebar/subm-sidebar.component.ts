import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServerError } from 'app/shared/server-error.handler';
import { isArrayEmpty, flatMap } from 'app/utils';
import { SectionForm } from '../shared/model/section-form.model';
import { SubmEditService } from '../shared/subm-edit.service';
import { CustomFormControl } from '../shared/model/custom-form-control.model';

type FormControlGroup = Array<FormControl>;

@Component({
  selector: 'st-subm-sidebar',
  templateUrl: './subm-sidebar.component.html',
  styleUrls: ['./subm-sidebar.component.scss']
})
export class SubmSidebarComponent implements OnDestroy {
  @Input() collapsed?: boolean = false;
  invalidControls: FormControlGroup[] = [];
  isCheckTabActive: boolean = true;
  serverError?: ServerError;
  showAdvanced: boolean = false;

  private controls: Array<FormControl>[] = [];
  private unsubscribe = new Subject<void>();
  private unsubscribeForm = new Subject<void>();

  constructor(private submEditService: SubmEditService) {
    this.submEditService.sectionSwitch$.pipe(takeUntil(this.unsubscribe)).subscribe((sectionForm) => {
      this.switchSection(sectionForm);
    });
  }

  get isEditTabActive(): boolean {
    return !this.isCheckTabActive;
  }

  get numInvalid(): number {
    return flatMap(this.invalidControls, (c) => c).length;
  }

  get numInvalidAndTouched(): number {
    return flatMap(this.invalidControls, (c) => c).filter((c) => c.touched).length;
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

  private groupControlsBySectionId(controls: FormControl[]): FormControlGroup[] {
    return controls.reduce((rv, c) => {
      const group = isArrayEmpty(rv) ? undefined : rv[rv.length - 1];
      const prevControl = group === undefined ? undefined : group[group.length - 1];
      if (prevControl !== undefined && CustomFormControl.compareBySectionId(prevControl, c) === 0) {
        group!.push(c);
      } else {
        rv.push([c]);
      }
      return rv;
    }, [] as Array<FormControlGroup>);
  }

  private switchSection(sectionFormOp: SectionForm | null): void {
    if (sectionFormOp) {
      const secForm = sectionFormOp!;

      this.unsubscribeForm.next();

      secForm.structureChanges$.pipe(takeUntil(this.unsubscribeForm)).subscribe(() => {
        this.controls = this.groupControlsBySectionId(secForm.controls());
        this.updateInvalidControls();
      });

      secForm.form.statusChanges.pipe(takeUntil(this.unsubscribeForm)).subscribe(() => this.updateInvalidControls());
    }
  }

  private updateInvalidControls(): void {
    this.invalidControls = this.controls.map((g) => g.filter((c) => c.invalid)).filter((g) => !isArrayEmpty(g));
  }
}
