import { Component, Input } from '@angular/core';

@Component({
  selector: 'st-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  @Input() message = 'The requested page was not found';

  sendEmail(): void {
    window.location.href = 'mailto:biostudies@ebi.ac.uk?Subject=BioStudies Submission Tool Page not found';
  }
}
