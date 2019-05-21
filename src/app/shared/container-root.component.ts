import { Component } from '@angular/core';

@Component({
    selector: 'container-root',
    template: `
    <div class="container-fluid">
    <div class="row-offcanvas row-offcanvas-left clearfix">
         <ng-content></ng-content>
    </div>
</div>
    `
})
export class ContainerRootComponent {
}
