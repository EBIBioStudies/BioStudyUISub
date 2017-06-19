import {
    Component,
    Input
} from '@angular/core';

@Component({
    selector: 'subm-navbar',
    templateUrl: './subm-navbar.component.html',
    host: {'class': 'navbar-subm-fixed navbar-default'}
})
export class SubmissionNavBarComponent {
    @Input() accno: string;
}