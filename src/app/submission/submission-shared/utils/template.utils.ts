import { ExtCollection } from 'app/submission/submission-shared/model/ext-submission-types';
import { DEFAULT_TEMPLATE_NAME, READONLY_TEMPLATE_NAME } from '../model/templates';

export function findSubmissionTemplateName(collections: ExtCollection[] = []): string {
  const collectionAccNo = collections.length === 0 ? '' : collections[0].accNo;

  if (collectionAccNo.length === 0) {
    return DEFAULT_TEMPLATE_NAME;
  }

  if (collectionAccNo.length > 0) {
    return collectionAccNo;
  }

  return READONLY_TEMPLATE_NAME;
}
