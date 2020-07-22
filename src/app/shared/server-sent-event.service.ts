import { Injectable } from '@angular/core';

@Injectable()
export class ServerSentEventService {
  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}
