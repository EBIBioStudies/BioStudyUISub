import {Component} from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
    <app-header></app-header>
    <div class="outlet">
        <router-outlet></router-outlet>
    </div>    
    `
})

export class AppComponent {
}