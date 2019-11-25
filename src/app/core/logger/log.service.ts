import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSession } from 'app/auth/shared';
import { LogConsole } from './publishers/log-console';
import { LogEntry } from './log-entry';
import { LogLevel } from './log-levels';
import { LogPublisher } from './publishers/log-publisher';
import { LogWebApi } from './publishers/log-webapi';

@Injectable()
export class LogService {
  publishers: LogPublisher[] = [];

  constructor(
    private useSession: UserSession,
    private http: HttpClient
  ) {
    this.buildPublishers();
  }

  error(message: string, ...optionalParams: any[]) {
    this.writeToLog(message, LogLevel.ERROR, optionalParams);
  }

  info(message: string, ...optionalParams: any[]) {
    this.writeToLog(message, LogLevel.INFO, optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.writeToLog(message, LogLevel.WARN, optionalParams);
  }

  private buildPublishers() {
    const consolePublisher: LogPublisher = new LogConsole();
    const webapiPublisher: LogWebApi = new LogWebApi(this.http);

    this.publishers.push(consolePublisher);
    this.publishers.push(webapiPublisher);
  }

  private writeToLog(message: string, level: LogLevel, params: any[]) {
    const userEmail: string = this.useSession.getUserEmail();
    const entry: LogEntry = new LogEntry(message, level, params, userEmail);

    this.publishers.forEach((publisher: LogPublisher) => {
      publisher.log(entry, level);
    });
  }
}
