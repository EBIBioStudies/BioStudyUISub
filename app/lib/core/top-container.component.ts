import {Component} from '@angular/core';

@Component({
    selector: 'top-container',
    template: `
    <div class="container-fluid">
    <div class="row-offcanvas row-offcanvas-left">
         <ng-content></ng-content>
    </div>
</div>
    `
})

export class TopContainerComponent {
}