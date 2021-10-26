import { Component, Input } from '@angular/core';

@Component({
  selector: 'st-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  @Input() message: string = 'The requested resource was not found';
  code: string = '404';
}
