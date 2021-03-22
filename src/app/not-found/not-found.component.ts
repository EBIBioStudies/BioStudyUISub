import { Component } from '@angular/core';

@Component({
  selector: 'st-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  sendEmail(): void {
    window.location.href = 'mailto:biostudies@ebi.ac.uk?Subject=BioStudies Submission Tool Page not found';
  }
}
