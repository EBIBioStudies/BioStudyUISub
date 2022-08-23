import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from 'app/core/errors/error.service';

enum UploadEventType {
  PROGRESS,
  SUCCESS,
  ERROR,
  OTHER
}

export class UploadEvent {
  private static SUCCESS_EVENT = new UploadEvent(UploadEventType.SUCCESS);

  constructor(private readonly type: UploadEventType = UploadEventType.OTHER) {}

  static error(title: string, detail: string): UploadErrorEvent {
    return new UploadErrorEvent(title, detail);
  }

  static fromHttpEvent(event: HttpEvent<any>): UploadEvent {
    switch (event.type) {
      case HttpEventType.Sent:
        return UploadEvent.progress(0);
      case HttpEventType.UploadProgress: {
        const percentDone = Math.round((100 * event.loaded) / (event.total || 1));
        return UploadEvent.progress(percentDone);
      }
      case HttpEventType.Response:
        return UploadEvent.SUCCESS_EVENT;
      default:
        return new UploadEvent();
    }
  }

  static progress(percentage: number): UploadEvent {
    return new UploadProgressEvent(percentage);
  }

  isError(): boolean {
    return this.type === UploadEventType.ERROR;
  }

  isProgress(): boolean {
    return this.type === UploadEventType.PROGRESS;
  }

  isSuccess(): boolean {
    return this.type === UploadEventType.SUCCESS;
  }
}

export class UploadProgressEvent extends UploadEvent {
  constructor(readonly percentage: number) {
    super(UploadEventType.PROGRESS);
  }
}

export class UploadErrorEvent extends UploadEvent {
  constructor(readonly title: string, readonly detail: string) {
    super(UploadEventType.ERROR);
  }
}

@Injectable()
export class HttpUploadClientService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  upload(url: string, formData: FormData): Observable<UploadEvent> {
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      map((event) => UploadEvent.fromHttpEvent(event)),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<UploadEvent> {
    const title = this.errorService.getServerErrorMessage(error, true);
    const detail = error.message;

    return of(UploadEvent.error(title, detail));
  }
}
