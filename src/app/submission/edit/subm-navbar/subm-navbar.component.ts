import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {
    Section
} from '../../shared/submission.model';

@Component({
    selector: 'subm-navbar',
    templateUrl: './subm-navbar.component.html',
    host: {'class': 'navbar-subm-fixed navbar-default'}
})
export class SubmNavBarComponent {
    @Input() accno: string;
    @Input() sectionPath: Section[];

    @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();

    onSectionClick(ev: Section): void {
        this.sectionClick.next(ev);
    }
}