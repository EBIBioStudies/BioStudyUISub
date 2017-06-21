import {
    Component,
    Input,
    OnChanges,
    SimpleChanges, Output, EventEmitter
} from '@angular/core';

import {
    Submission,
    Section
} from '../../shared/submission.model';

@Component({
    selector: 'subm-navbar',
    templateUrl: './subm-navbar.component.html',
    host: {'class': 'navbar-subm-fixed navbar-default'}
})
export class SubmNavBarComponent implements OnChanges {
    @Input() accno: string;
    @Input() submission: Submission;
    @Input() submSection: Section;

    @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();

    sections: Section[];

    ngOnChanges(changes: SimpleChanges): void {
        this.sections = (this.submission == undefined) ? [] :
            this.submission
                .path(this.submSection.id);
    }

    onSectionClick(ev: Section): void {
        this.sectionClick.next(ev);
    }
}