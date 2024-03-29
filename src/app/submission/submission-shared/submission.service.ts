import { SectionData } from './model/submission/submission.model';
import * as HttpStatus from 'http-status-codes';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isDefinedAndNotEmpty } from 'app/utils/validation.utils';
import { PageTab, DraftPayload } from './model/pagetab';
import { SubmissionToPageTabService } from './submission-to-pagetab.service';
import { filterAndFormatDraftSubmissions } from './utils/submission-draft.utils';
import { AttributeNames } from '../utils/constants';

export interface DraftSubmissionWrapper {
  key: string;
  content: PageTab;
}

export interface SubmissionListItem {
  accno: string;
  mtime: number;
  rtime: number;
  status: string;
  title: string;
}

export interface SubmitResponse {
  accno: string;
  attributes: Array<any>;
  section: SectionData;
  log: LogDetail;
}

export interface SubmissionListParams {
  accNo?: string;
  keywords?: string[];
  limit?: number;
  offset?: number;
  rTimeFrom?: number;
  rTimeTo?: number;
}

export const preferredSourceMap = {
  SUBMISSION: 'SUBMISSION'
};

function definedPropertiesOnly(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      let value = obj[key];
      if (typeof obj[key] === 'object') {
        value = definedPropertiesOnly(value);
      }
      result[key] = value;
    }
  });
  return result;
}

@Injectable()
export class SubmissionService {
  constructor(private http: HttpClient, private submissionToPageTab: SubmissionToPageTabService) {}

  /**
   * Traverses the error log tree to find the first deepest error message.
   * @param obj - Log tree's root node or subnode list.
   * @returns Error message.
   */
  static deepestError(log: LogDetail): string {
    const errorNode = (log.subnodes || []).find((n) => n.level === 'ERROR');

    if (errorNode === undefined) {
      return log.message || 'Unknown error';
    }

    return this.deepestError(errorNode);
  }

  createDraftSubmission(collection?: string, templateName?: string): Observable<string> {
    const emptySubmission: PageTab = this.submissionToPageTab.newPageTab(collection, templateName);

    return this.http
      .post<DraftPayload>('/api/submissions/drafts', emptySubmission)
      .pipe(map((response) => response.key));
  }

  deleteDraft(accno: string): Observable<boolean> {
    return this.http.delete(`/api/submissions/drafts/${accno}`).pipe(map(() => true));
  }

  deleteSubmitted(accno: string): Observable<boolean> {
    return this.http.delete(`/api/submissions/${accno}`).pipe(map(() => true));
  }

  directSubmit(file: File, attachTo: string): Observable<SubmitResponse> {
    const formData = new FormData();

    if (isDefinedAndNotEmpty(attachTo)) {
      const collection = { name: AttributeNames.ATTACH_TO, value: attachTo };
      formData.append('attributes', JSON.stringify(collection));
    }

    formData.append('submission', file);

    return this.http.post<SubmitResponse>('/api/submissions/async/direct', formData);
  }

  getSubmission(accno: string): Observable<PageTab> {
    return this.getDraft(accno);
  }

  getSubmissions(submitted: boolean, params: SubmissionListParams = {}): Observable<SubmissionListItem[]> {
    const url = submitted ? '/api/submissions' : '/api/submissions/drafts';
    return this.http
      .get<SubmissionListItem[]>(url, { params: definedPropertiesOnly(params) })
      .pipe(
        map((items) => {
          return submitted ? items : filterAndFormatDraftSubmissions(items);
        })
      );
  }

  updateDraft(accno: string, pt: PageTab): Observable<DraftSubmissionWrapper> {
    return this.http.put<DraftSubmissionWrapper>(`/api/submissions/drafts/${accno}`, pt);
  }

  submitDraft(accno: string, onlyMetadataUpdate: boolean): Observable<SubmitResponse> {
    const headers: HttpHeaders = new HttpHeaders().set('Submission_Type', 'application/json');
    const params = this.preferredSources(onlyMetadataUpdate);

    return this.sendPostRequest({ path: `/api/submissions/drafts/${accno}/submit`, payload: null, headers, params });
  }

  private preferredSources(onlyMetadataUpdate): HttpParams {
    if (onlyMetadataUpdate) {
      return new HttpParams().append('preferredSources', preferredSourceMap.SUBMISSION);
    }

    return new HttpParams();
  }

  validateFileList(fileListName: string, accNo: string): Observable<StatusResponse> {
    const formData = new FormData();

    formData.append('accNo', accNo);
    formData.append('fileListName', fileListName);

    return this.http.post<StatusResponse>('/api/submissions/fileLists/validate', formData);
  }

  private checkStatus<R, T>(response: HttpResponse<R>): T {
    if (response.status === HttpStatus.OK) {
      return (response.body || {}) as T;
    }

    throw response.body;
  }

  private getDraft(accno: string): Observable<PageTab> {
    return this.http.get<PageTab>(`/api/submissions/drafts/${accno}/content`);
  }

  private sendPostRequest<R, T>({
    path,
    payload,
    headers,
    params
  }: {
    path: string;
    payload: any;
    headers: HttpHeaders;
    params: HttpParams;
  }): Observable<T> {
    return this.http
      .post<R>(path, payload, { headers, params, observe: 'response' })
      .pipe(
        catchError((response: HttpErrorResponse) => {
          throw response.error;
        }),
        map((response: HttpResponse<R>) => this.checkStatus<R, T>(response))
      );
  }
}
