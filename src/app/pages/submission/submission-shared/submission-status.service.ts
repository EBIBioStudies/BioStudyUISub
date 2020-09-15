import { ServerSentEventService } from 'app/shared/server-sent-event.service';
import { Observable } from 'rxjs';
import { NgZone, Injectable } from '@angular/core';

export interface SubmStatus {
  accNo: string,
  status: string
}

@Injectable()
export class SubmissionStatusService {
  eventSource: EventSource | undefined;

  constructor(private zone: NgZone, private sseService: ServerSentEventService) {
    try {
      this.eventSource = this.sseService.getEventSource('/subm-status');
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error('get-subm-status', 'SubmissionStatusService: could not stablish event source connection', error);
    }
  }

  getSubmStatus(): Observable<SubmStatus> {
    return Observable.create((observer) => {
      this.eventSource!.addEventListener('message', (event: MessageEvent) => {
        const { data } = event;
        const parsedData: SubmStatus = JSON.parse(data);

        this.zone.run(() => {
          observer.next(parsedData);
        });

        return () => this.eventSource?.close();
      });

      this.eventSource!.onerror = (error) => {
        // tslint:disable-next-line: no-console
        console.error('get-subm-status', 'SubmissionStatusService: EventSource has stopped', error);
      };
    });
  }
}
