import { Component } from '@angular/core';

@Component({
  selector: 'st-auth-container',
  template: `
  <div class="container-fluid auth-container">
    <div class="row-offcanvas row-offcanvas-left clearfix">
      <ng-content></ng-content>
    </div>
  </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      height: calc(100vh - 60px);
      justify-content: center;
      overflow: auto;
    }
  `]
})
export class AuthContainerComponent {}
