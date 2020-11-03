import { Component } from '@angular/core';

@Component({
  selector: 'st-auth-container',
  template: `
   <div class="auth-container">
      <ng-content></ng-content>
   </div>
  `,
  styles: [`
    .auth-container {
      margin: auto;
      max-width: 700px;
      padding: 15px;
      width: 100%;
    }`
  ]
})
export class AuthContainerComponent {}
