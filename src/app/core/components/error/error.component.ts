import { Component, Input } from '@angular/core';

@Component({
  selector: 'st-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  @Input() message: string = 'The requested page was not found';
  @Input() code: string = '404';

  sendEmail(): void {
    window.location.href = `mailto:biostudies@ebi.ac.uk?Subject=BioStudies Submission Tool Page ${this.code} error`;
  }
}
