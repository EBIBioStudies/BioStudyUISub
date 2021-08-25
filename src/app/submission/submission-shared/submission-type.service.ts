import { Injectable } from '@angular/core';
import { SubmissionType } from './model/submission-type.model';
import { SubmissionTemplatesService } from 'app/submission/submission-shared/submission-templates.service';

@Injectable()
export class SubmissionTypeService {
  constructor(private submissionTemplateService: SubmissionTemplatesService) {}

  fromTemplate(tmplName: string): SubmissionType {
    return SubmissionType.fromTemplate(tmplName, this.submissionTemplateService);
  }
}
