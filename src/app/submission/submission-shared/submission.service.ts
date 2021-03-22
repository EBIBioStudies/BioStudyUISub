import { SectionData } from './model/submission/submission.model';
import * as HttpStatus from 'http-status-codes';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isDefinedAndNotEmpty } from 'app/utils';
import { PageTab, DraftPayload } from './model/pagetab';
import { SubmissionDraftUtils } from './utils/submission-draft.utils';

export interface DraftSubmission {
  accno: string;
  changed: number;
  data: PageTab;
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
  log: SubmitLog;
}

export interface SubmitLog {
  level: string; // 'INFO'|'WARN'|'ERROR'
  message: string;
  subnodes: Array<SubmitLog>;
}

export interface SubmissionListParams {
  accNo?: string;
  keywords?: string[];
  limit?: number;
  offset?: number;
  rTimeFrom?: number;
  rTimeTo?: number;
}

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
  private submissionDraftUtils: SubmissionDraftUtils;

  constructor(private http: HttpClient) {
    this.submissionDraftUtils = new SubmissionDraftUtils();
  }

  /**
   * Traverses the error log tree to find the first deepest error message.
   * @param obj - Log tree's root node or subnode list.
   * @returns Error message.
   */
  static deepestError(log: SubmitLog): string {
    const errorNode = (log.subnodes || []).find((n) => n.level === 'ERROR');

    if (errorNode === undefined) {
      return log.message || 'Unknown error';
    }

    return this.deepestError(errorNode);
  }

  createDraftSubmission(pt: PageTab): Observable<string> {
    return this.http.post<DraftPayload>('/api/submissions/drafts', pt).pipe(map((response) => response.key));
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
      formData.append('AttachTo', attachTo);
    }

    formData.append('submission', file);

    return this.http.post<SubmitResponse>(`/api/submissions/direct`, formData);
  }

  getProjects(): Observable<any> {
    return this.http.get('/api/projects');
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
          return submitted ? items : this.submissionDraftUtils.filterAndFormatDraftSubmissions(items);
        })
      );
  }

  updateDraft(accno: string, pt: PageTab): Observable<any> {
    return this.http.put<PageTab>(`/api/submissions/drafts/${accno}`, pt).pipe(map(() => 'done'));
  }

  submitDraft(pt: PageTab, accno: string): Observable<SubmitResponse> {
    const headers: HttpHeaders = new HttpHeaders().set('Submission_Type', 'application/json');

    return this.sendPostRequest(`/api/submissions/drafts/${accno}/submit`, pt, headers);
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

  private sendPostRequest<R, T>(path: string, payload: any, headers: HttpHeaders): Observable<T> {
    return this.http
      .post<R>(path, payload, { headers, observe: 'response' })
      .pipe(
        catchError((response: HttpErrorResponse) => {
          throw response.error;
        }),
        map((response: HttpResponse<R>) => this.checkStatus<R, T>(response))
      );
  }
}
