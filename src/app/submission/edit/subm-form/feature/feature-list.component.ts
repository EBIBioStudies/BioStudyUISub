import {
    AfterViewInit,
    Component, ElementRef,
    Input, QueryList, ViewChildren
} from '@angular/core';

import {Attribute, Feature} from '../../../shared/submission.model';
import {FeatureForm} from '../subm-form.service';

@Component({
    selector: 'subm-feature-list',
    templateUrl: './feature-list.component.html',
    styleUrls: ['./feature-list.component.css']
})
export class FeatureListComponent implements AfterViewInit {
    @Input() featureForm: FeatureForm;
    @Input() readonly?: boolean = false;
    @ViewChildren('rowEl') rowEls: QueryList<ElementRef>;

    get columns(): Attribute[] {
        return this.featureForm.columns
    }

    get feature(): Feature {
        return this.featureForm.feature;
    }

    //On DOM change, sets focus on first field of newly added row
    ngAfterViewInit(): void {
        this.rowEls.changes.subscribe((rowEls) => {
            rowEls.last.nativeElement.querySelector('select, input').focus();
        });
    }
}
