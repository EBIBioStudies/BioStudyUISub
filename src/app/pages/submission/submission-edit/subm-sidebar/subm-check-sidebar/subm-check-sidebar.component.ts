import { FormControl, ValidationErrors } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ServerError } from 'app/shared/server-error.handler';
import { SubmEditService } from '../../shared/subm-edit.service';

@Component({
  selector: 'st-subm-check-sidebar',
  templateUrl: './subm-check-sidebar.component.html'
})
export class SubmCheckSidebarComponent {
  @Input() collapsed?: boolean = false;
  @Input() invalidControls: FormControl[][] = [];
  @Input() serverError?: ServerError;

  constructor(private submEditService: SubmEditService) {}

  get isLoading(): boolean {
    return this.submEditService.isLoading;
  }

  get isSubmitting(): boolean {
    return this.submEditService.isSubmitting;
  }

  /**
   * Determines the text corresponding to a certain error status in the event of no message being provided already.
   * @returns {string} Descriptive text for the error.
   */
  errorMsg(): string {
    const error = this.serverError;

    if (!error) {
      return '';
    }

    if (error.message) {
      return error.message;
    } else {
      switch (error.status) {
        case 401:
          return 'Authorization error';
        case 403:
          return 'Forbidden access';
        case 404:
          return 'Submission not found';
        case 500:
          return 'Server error';
        default:
          return 'Error encountered';
      }
    }
  }

  /**
   * Scrolls to and sets focus on the field represented by the form control clicked on within the check tab.
   * @param {FieldControl} control - Form control augmented with the DOM element for the field.
   */
  onReviewClick(control: FormControl) {
    const element: HTMLElement  = (<any>control).nativeElement;

    if (element !== undefined) {
      const rect = element.getBoundingClientRect();

      if (!this.isInViewPort(rect)) {
        window.scrollBy(0, rect.top - 120);
      }

      const elementRef: HTMLTextAreaElement | HTMLInputElement =
        element.querySelectorAll<HTMLTextAreaElement | HTMLInputElement>('input, textarea')[0];

      elementRef.focus();
    }
  }

  /**
   * Determines the abbreviated text matching a certain error key.
   * @param {ValidationErrors} errors Set of error keys.
   * @returns {string} Abbreviated text
   */
  tipText(errors: ValidationErrors): string {
    if (errors.required) {
      return 'blank';
    } else if (errors.maxlength) {
      return 'too long';
    } else if (errors.minlength) {
      return 'too short';
    } else if (errors.pattern) {
      return 'wrong format';
    } else if (errors.unique) {
      return 'not unique';
    }
    return Object.keys(errors)[0];
  }

  private isInViewPort(rect: { bottom: number, left: number, right: number, top: number }) {
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement!.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement!.clientWidth)
    );
  }
}
