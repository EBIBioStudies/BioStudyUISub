import { Observable } from 'rxjs';
import { NgZone, Injectable } from '@angular/core';
import { ServerSentEventService } from 'app/shared/server-sent-event.service';
import { isStringDefined } from 'app/utils/validation.utils';
import { PlatformLocation } from '@angular/common';

@Injectable()
export class SubmissionStatusService {
  eventSource: EventSource | undefined;

  constructor(private zone: NgZone, private sseService: ServerSentEventService, platformLocation: PlatformLocation) {
    try {
      const baseHref: string = platformLocation.getBaseHrefFromDOM();

      this.eventSource = this.sseService.getEventSource(`${baseHref}subm-status`);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error('get-subm-status', 'SubmissionStatusService: could not stablish event source connection', error);
    }
  }

  getSubmStatus(): Observable<string> {
    return new Observable((observer) => {
      this.eventSource!.addEventListener('message', (event: MessageEvent) => {
        const { data } = event;
        const { accNo } = JSON.parse(data);

        this.zone.run(() => {
          if (isStringDefined(accNo)) {
            observer.next(accNo);
          }
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
