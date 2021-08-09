import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'st-new-submission-button',
  templateUrl: './new-submission-button.component.html'
})
export class NewSubmissionButtonComponent {
  @Input() isBusy: boolean = false;
  @Input() isSmall: boolean = false;

  constructor(private router: Router) {}

  /**
   * Handler for the click event on the upload submission button, redirecting to a new view.
   * @param event - Click event object, the bubbling of which will be prevented.
   */
  onUploadSubmClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/direct_upload']);
  }
}
