import { SubmissionListItem } from '../submission.service';

export class SubmissionDraftUtils {
  formatDraftSubmissions(drafts): SubmissionListItem[] {
    return drafts.map((draft) => {
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
