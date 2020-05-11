import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Section } from 'app/pages/submission/submission-shared/model/submission';
import { SectionForm } from '../shared/model/section-form.model';
import { SubmEditService } from '../shared/subm-edit.service';

@Component({
  selector: 'st-subm-navbar',
  templateUrl: './subm-navbar.component.html',
  styleUrls: ['./subm-navbar.component.css']
})
export class SubmNavBarComponent implements OnChanges {
  @Input() accno?: string; // accession number for the current submission
  @Output() editClick: EventEmitter<Event> = new EventEmitter<Event>();
  @Input() readonly: boolean = false; // read-only status of the submission form
  @Output() revertClick: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();
  @Input() sectionForm?: SectionForm;

  sectionPath: SectionForm[] = [];
  @Output() submitClick: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(private submEditService: SubmEditService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sectionForm !== null) {
      this.sectionPath = this.findSectionPath(this.sectionForm);
    }
  }

  onEdit(event: Event): void {
    this.editClick.next(event);
  }

  onRevert(event: Event): void {
    this.revertClick.next(event);
  }

  onSectionClick(section: Section): void {
    this.sectionClick.next(section);
  }

  onSubmit(event: Event): void {
    this.submitClick.next(event);
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

  get isSaving(): boolean {
    return this.submEditService.isSaving;
  }

  private findSectionPath(sectionForm?: SectionForm): SectionForm[] {
    if (sectionForm === undefined) {
      return [];
    }
    return [...this.findSectionPath(sectionForm.parent), ...[sectionForm]];
  }
}
