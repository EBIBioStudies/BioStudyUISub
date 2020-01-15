import { ChangeDetectorRef, Component, ElementRef, ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from 'app/global-error.handler';

@Component({
  selector: 'st-error-toast',
  templateUrl: './error-toast.component.html',
  styleUrls: ['./error-toast.component.css']
})
export class ErrorToastComponent {
  message: string = '';

  /**
   * Captures async errors and refreshes the UI (slides an alert in).
   * @param {ErrorHandler} geh - Global handler for errors.
   * @param {ChangeDetectorRef} changeRef - Forces change detection on this component.
   * @param {ElementRef} rootEl - Reference to the component's wrapping element
   */
  constructor (geh: ErrorHandler, changeRef: ChangeDetectorRef, private rootEl: ElementRef) {
    if (geh instanceof GlobalErrorHandler) {
      geh.errorDetected.subscribe(error => {

        // Message conversion is bypassed to allow for plain strings as error exception objects.
        if (typeof error === 'string') {
          this.message = error;
        } else {
          this.message = this.toMessage(error);
        }

        changeRef.detectChanges();
        rootEl.nativeElement.firstChild.classList.add('slide-in');
      });
    }
  }

  /**
   * Slides the alert out of view when performing the close action.
   */
  onClose() {
    this.rootEl.nativeElement.firstChild.classList.remove('slide-in');
  }

  /**
   * Merges different error properties to produce the string to be shown as an error message. If there is
   * no network, the user is instead alerted to that.
   * @param error - Error object containing fragments of the error message.
   * @returns {string} - Text to be used as an error message.
   */
  toMessage(error: any): string {

    // There seems to be network connection
    if (navigator.onLine) {
      const name = error.name || '';
      const message = error.message || '';
      return (name + message).length === 0 ? 'Unknown error' : (name + ' ' + message);

    // Definitely not connected
    } else {
      return 'You seem to be offline. Please check your network.';
    }
  }
}
