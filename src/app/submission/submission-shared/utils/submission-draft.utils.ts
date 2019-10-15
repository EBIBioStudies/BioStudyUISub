import { SubmissionListItem } from '../submission.service';

export class SubmissionDraftUtils {
  filterAndFormatDraftSubmissions(drafts): SubmissionListItem[] {
    const tempDrafts = drafts.filter((draft) => (draft.key.indexOf('TMP') === 0));
    const validDrafts = tempDrafts.filter((draft) => draft.content.attributes !== undefined);

    return validDrafts.map((draft) => {
        const { key, content: { attributes } } = draft;
        const titleAttribute = attributes.find((attribute) => attribute.name === 'Title') || {};
        const releaseDateAttribute = attributes.find((attribute) => attribute.name === 'ReleaseDate') || {};
        const title = titleAttribute.value;
        const release = releaseDateAttribute.value;

        return {
          accno: key,
          title: title === undefined ? '' : title,
          rtime: (String.isDefinedAndNotEmpty(release) || release === '') ? null : release
        };
      });
  }
}
