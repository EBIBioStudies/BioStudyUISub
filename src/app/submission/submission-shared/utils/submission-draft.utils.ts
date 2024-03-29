import { SubmissionListItem } from '../submission.service';
import { isDefinedAndNotEmpty } from 'app/utils/validation.utils';

export function filterAndFormatDraftSubmissions(drafts): SubmissionListItem[] {
  return drafts.map((draft) => {
    const {
      key,
      content: { attributes = [] }
    } = draft;

    const titleAttribute =
      attributes.find((attribute) => attribute.name === 'Title') ||
      draft?.content?.section?.attributes.find((attribute) => attribute.name === 'Title') ||
      {};
    const releaseDateAttribute = attributes.find((attribute) => attribute.name === 'ReleaseDate') || {};
    const title = titleAttribute.value;
    const release = releaseDateAttribute.value;

    return {
      accno: key,
      title: title === undefined ? '' : title,
      rtime: isDefinedAndNotEmpty(release) || release === '' ? null : release
    };
  });
}
