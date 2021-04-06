import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSession } from 'app/auth/shared/';
import { LogConsole } from './publishers/log-console';
import { LogEntry } from './log-entry';
import { LogLevel } from './log-levels';
import { LogPublisher } from './publishers/log-publisher';
import { LogWebApi } from './publishers/log-webapi';

@Injectable()
export class LogService {
  publishers: LogPublisher[] = [];

  constructor(private useSession: UserSession, private http: HttpClient) {
    this.buildPublishers();
  }

  error(message: string, stackTrace?: string): void {
    this.writeToLog(message, LogLevel.ERROR, stackTrace);
  }

  info(message: string): void {
    this.writeToLog(message, LogLevel.INFO);
  }

  warn(message: string): void {
    this.writeToLog(message, LogLevel.WARN);
  }

  private buildPublishers(): void {
    const consolePublisher: LogPublisher = new LogConsole();
    const webapiPublisher: LogWebApi = new LogWebApi(this.http);

    this.publishers.push(consolePublisher);
    this.publishers.push(webapiPublisher);
  }

  private writeToLog(message: string, level: LogLevel, stackTrace?: string): void {
    const userEmail: string = this.useSession.getUserEmail();
    const entry: LogEntry = new LogEntry(message, level, stackTrace, userEmail);

    this.publishers.forEach((publisher: LogPublisher) => {
      publisher.log(entry, level);
    });
  }
}
