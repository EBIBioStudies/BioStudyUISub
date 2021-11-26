import { FormGroup, FormControl } from '@angular/forms';
import { controlToList } from '../utils';

export class FormBase {
  private formErrorCount: number = 0;

  constructor(readonly form: FormGroup) {
    form.statusChanges.subscribe(() => this.onStatusChanges());
  }

  get errorCount(): number {
    return this.formErrorCount;
  }

  get hasErrors(): boolean {
    return this.form.invalid && this.form.touched;
  }

  get invalid(): boolean {
    return this.form.invalid;
  }

  get valid(): boolean {
    return this.form.valid;
  }

  get pending(): boolean {
    return this.form.pending;
  }

  controls(): FormControl[] {
    return controlToList(this.form).reverse();
  }

  invalidControls(): FormControl[] {
    return this.controls().filter((control) => control.invalid);
  }

  private onStatusChanges(): void {
    this.formErrorCount = this.invalidControls().length;
  }
}
