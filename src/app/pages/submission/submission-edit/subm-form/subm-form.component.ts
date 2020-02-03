import { Component, Input } from '@angular/core';
import { SectionForm } from '../shared/model/section-form.model';

@Component({
  selector: 'st-subm-form',
  templateUrl: './subm-form.component.html'
})
export class SubmFormComponent {
  @Input() readonly?: boolean = false;
  @Input() sectionForm?: SectionForm;

  constructor() {}
}
