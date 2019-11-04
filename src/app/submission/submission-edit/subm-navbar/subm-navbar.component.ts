import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Section } from 'app/submission/submission-shared/model/submission';
import { SectionForm } from '../shared/section-form';
import { SubmEditService } from '../shared/subm-edit.service';

@Component({
    selector: 'st-subm-navbar',
    templateUrl: './subm-navbar.component.html',
    styleUrls: ['./subm-navbar.component.css']
})
export class SubmNavBarComponent implements OnChanges {
    @Input() sectionForm?: SectionForm;
    @Input() accno?: string; // accession number for the current submission
    @Input() readonly: boolean = false; // read-only status of the submission form
    @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();
    @Output() revertClick: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() submitClick: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() editClick: EventEmitter<Event> = new EventEmitter<Event>();

    sectionPath: SectionForm[] = [];

    constructor(private submEditService: SubmEditService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.sectionForm !== null) {
            this.sectionPath = this.findSectionPath(this.sectionForm);
        }
    }

    onSectionClick(section: Section): void {
        this.sectionClick.next(section);
    }

    onRevert(event: Event): void {
        this.revertClick.next(event);
    }

    onSubmit(event: Event): void {
        this.submitClick.next(event);
    }

    onEdit(event: Event): void {
        this.editClick.next(event);
    }

    // TODO: a temporary workaround
    get isTemp(): boolean {
        return this.accno!.startsWith('TMP_');
    }

    // TODO: a temporary workaround
    get isRevised(): boolean {
        return true;
    }

    get isEditing(): boolean {
        return this.submEditService.isEditing;
    }

    private findSectionPath(sectionForm?: SectionForm): SectionForm[] {
        if (sectionForm === undefined) {
            return [];
        }
        return [...this.findSectionPath(sectionForm.parent), ...[sectionForm]];
    }
}
