import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogPublisher } from './log-publisher';
import { LogEntry } from '../log-entry';
import { LogLevel } from '../log-levels';

export class LogWebApi extends LogPublisher {
  http: HttpClient;

  private allowedLevels: LogLevel[] = [LogLevel.ERROR, LogLevel.UPLOAD];

  constructor(http: HttpClient) {
    super();
    this.http = http;
  }

  log(entry: LogEntry, level: LogLevel) {
    // Only send errors to external service.
    if (this.allowedLevels.includes(level)) {
      this.send(entry);
    }
  }

  private send(entry: LogEntry) {
    this.http.post('/log', entry.buildLogJsonFormat()).subscribe();
  }
}
