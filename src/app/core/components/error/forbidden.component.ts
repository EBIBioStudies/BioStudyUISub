import { Component, Input } from '@angular/core';

@Component({
  selector: 'st-forbidden',
  templateUrl: './forbidden.component.html'
})
export class ForbiddenComponent {
  @Input() message: string = 'Not enough access rights to see this resource';
  code: string = '403';
}
