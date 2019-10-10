import { SubmissionListItem } from '../submission.service';

export class SubmissionDraftUtils {
  filterAndFormatDraftSubmissions(drafts): SubmissionListItem[] {
    return drafts
      .filter((draft) => (draft.accno.indexOf('TMP') === 0))
      .map((draft) => {
        const { accno, data: { attributes } } = draft;
        const titleAttribute = attributes.find((attribute) => attribute.name === 'Title') || {};
        const releaseDateAttribute = attributes.find((attribute) => attribute.name === 'ReleaseDate') || {};
        const title = titleAttribute.value;
        const release = releaseDateAttribute.value;

        return {
          accno,
          title: title ? '' : title,
          rtime: (String.isDefinedAndNotEmpty(release) || release === '') ? null : release
        };
      });
  }
}
