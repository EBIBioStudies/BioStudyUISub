import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { throwError } from 'rxjs';

@Component({
  selector: 're-captcha',
  template: `<input type="checkbox" id="recaptcha" name="recaptcha" (click)="toggleStatus()" checked="{{ isValid }}" />
    <label for="recaptcha">recaptcha</label>
    <div class="status">{{ status }}</div>`,
  styles: [],
  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => MockReCaptchaComponent) }]
})
export class MockReCaptchaComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() siteKey: string = '';
  @Input() tabIndex: number = 0;
  @Output() resolved = new EventEmitter<string>();

  isValid: boolean = false;
  status: string = '';

  toggleStatus() {
    const newStatus: boolean = !this.isValid;
    this.status = newStatus ? 'reCaptcha passed' : 'You robot!';

    this.writeValue(newStatus);

    if (this.isValid) {
      this.resolved.emit('recaptha-token-1234');
    } else {
      throwError('You robot!');
    }
  }

  execute(): void {}
  reset(): void {}

  writeValue(obj: any): void {
    this.isValid = obj;
  }

  setDisabledState?(): void {}

  registerOnChange(): void {}

  registerOnTouched(): void {}
}
