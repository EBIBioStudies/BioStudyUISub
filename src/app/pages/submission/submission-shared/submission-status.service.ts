import { ServerSentEventService } from 'app/shared/server-sent-event.service';
import { LogService } from 'app/core/logger/log.service';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';

export interface SubmStatus {
  accNo: string,
  status: string
}

export class SubmissionStatusService {
  eventSource: EventSource | undefined;

  constructor(private zone: NgZone, private sseService: ServerSentEventService, private logService: LogService) {}

  getSubmStatus(): Observable<SubmStatus> {
    try {
      this.eventSource = this.sseService.getEventSource('/subm-status');
    } catch (error) {
      this.logService.error('get-subm-status', 'SubmissionStatusService: could not stablish event source connection');
    }

    return Observable.create((observer) => {
      this.eventSource!.addEventListener('subm-status', (event: MessageEvent) => {
        const { data } = event;
        const parsedData: SubmStatus = JSON.parse(data);

        this.zone.run(() => {
          observer.next(parsedData);
        });
      });

      this.eventSource!.onerror = () => {
        this.logService.error('get-subm-status', 'SubmissionStatusService: EventSource has stopped');
      };
    });
  }
}
