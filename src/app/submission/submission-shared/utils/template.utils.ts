import { ExtCollection } from 'app/submission/submission-shared/model/ext-submission-types';
import { DEFAULT_TEMPLATE_NAME, READONLY_TEMPLATE_NAME } from '../model/templates';

export function findSubmissionTemplateName(projects: ExtCollection[] = []): string {
  const projectAccNo = projects.length === 0 ? '' : projects[0].accNo;

  if (projectAccNo.length === 0) {
    return DEFAULT_TEMPLATE_NAME;
  }

  if (projectAccNo.length > 0) {
    return projectAccNo;
  }

  return READONLY_TEMPLATE_NAME;
}
