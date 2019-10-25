import { Component } from '@angular/core';

@Component({
    selector: 'st-container-md',
    template: `
     <div class="row">
          <div class="col-md-6 col-md-offset-3">
               <ng-content></ng-content>
          </div>
     </div>
    `
})
export class ContainerMdComponent {
}
