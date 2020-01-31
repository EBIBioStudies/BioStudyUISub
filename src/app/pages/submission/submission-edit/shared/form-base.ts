import { FormGroup, FormControl } from '@angular/forms';
import { controlToList } from './utilis';

export class FormBase {
  private _errorCount: number = 0;

  constructor(readonly form: FormGroup) {
    form.statusChanges.subscribe(() => {
      this.onStatusChanges();
    });
  }

  get errorCount(): number {
    return this._errorCount;
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

  controls(): FormControl[] {
    return controlToList(this.form).reverse();
  }

  invalidControls(): FormControl[] {
    return this.controls().filter(control => control.invalid);
  }

  private onStatusChanges() {
    this._errorCount = this.invalidControls().length;
  }
}
