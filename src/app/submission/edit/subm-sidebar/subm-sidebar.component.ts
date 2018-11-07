import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ServerError} from '../../../http/server-error.handler';
import {SectionForm} from '../section-form';
import {SubmCheckSidebarComponent} from './subm-check-sidebar/subm-check-sidebar.component';
import {fromNullable} from 'fp-ts/lib/Option';


@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSidebarComponent {
    @Input() collapsed?: boolean = false;
    @Input() sectionForm?: SectionForm;
    @Output() toggle? = new EventEmitter();

    @ViewChild('checkTab') checkTab?: SubmCheckSidebarComponent;

    isCheckTabActive: boolean = true;

    get isEditTabActive(): boolean {
        return !this.isCheckTabActive;
    }

    get numInvalid(): number {
        return fromNullable(this.checkTab).map(tab => tab.numInvalid).getOrElse(0);
    }

    get numInvalidAndTouched(): number {
        return fromNullable(this.checkTab).map(tab => tab.numInvalidAndTouched).getOrElse(0);
    }

    get serverError(): ServerError | undefined {
        return fromNullable(this.checkTab).map(tab => tab.serverError).toUndefined();
    }

    onCheckTabClick(): void {
        this.isCheckTabActive = true;
    }

    onAddTabClick(): void {
        this.isCheckTabActive = false;
    }

    /**
     * Handler for the button toggling the collapsed state of the whole sidebar menu,
     * bubbling the menu's state up.
     * @param {Event} [event] - Optional click event object.
     */
    onToggleCollapse(event?: Event): void {
        event && event.preventDefault();
        this.toggle && this.toggle.emit();
    }
}