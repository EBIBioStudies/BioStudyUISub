import {Component} from '@angular/core';

@Component({
    selector: 'the-app',
    template: `
    <app-header></app-header>
    <ui-view></ui-view>
    `
})

export class AppComponent {
}