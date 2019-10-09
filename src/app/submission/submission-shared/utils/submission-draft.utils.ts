import { SubmissionListItem } from '../submission.service';

export class SubmissionDraftUtils {
  formatDraftSubmissions(drafts): SubmissionListItem[] {
    return drafts.map((draft) => ({
      accno: draft.accno,
      title: draft.data.attributes.find((attribute) => attribute.name === 'Title').value,
      rtime: draft.data.attributes.find((attribute) => attribute.name === 'ReleaseDate').value
    }));
  }
}
