import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { Section } from 'app/submission/submission-shared/model/submission';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SectionForm } from '../shared/model/section-form.model';
import { SubmEditService } from '../shared/subm-edit.service';
import { SubmResubmitModalComponent } from './subm-resubmit-modal.component';

@Component({
  selector: 'st-subm-navbar',
  templateUrl: './subm-navbar.component.html',
  styleUrls: ['./subm-navbar.component.scss']
})
export class SubmNavBarComponent implements OnChanges {
  @Input() accno!: string; // accession number for the current submission
  @Output() editClick: EventEmitter<Event> = new EventEmitter<Event>();
  @Input() readonly: boolean = false; // read-only status of the submission form
  @Output() revertClick: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();
  @Input() sectionForm?: SectionForm;
  @Output() submitClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  frontendURL: string = this.appConfig.frontendURL;
  sectionPath: SectionForm[] = [];

  constructor(
    private submEditService: SubmEditService,
    private appConfig: AppConfig,
    private modalService: BsModalService
  ) {}

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
    if (event) {
      event.preventDefault();
    }

    if (!this.isTemp && !this.accno.startsWith('E-')) {
      this.modalService.show(SubmResubmitModalComponent, {
        class: 'modal-lg',
        initialState: {
          onResubmit: (onlyMetadataUpdate) => this.submitClick.next(onlyMetadataUpdate)
        }
      });
    } else {
      this.submitClick.next(false);
    }
  }

  // TODO: a temporary workaround
  get isTemp(): boolean {
    return this.accno.startsWith('TMP_');
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

  get submissionUrl(): string {
    return `${this.frontendURL}/studies/${this.accno}`;
  }

  sectionName(section: Section): string {
    return section.accno ? section.accno : section.typeName;
  }

  private findSectionPath(sectionForm?: SectionForm): SectionForm[] {
    if (sectionForm === undefined) {
      return [];
    }
    return [...this.findSectionPath(sectionForm.parent), sectionForm];
  }
}
