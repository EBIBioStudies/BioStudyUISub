import { LogPublisher } from './log-publisher';
import { LogEntry } from '../log-entry';

export class LogConsole extends LogPublisher {
  log(entry: LogEntry): void {
    // tslint:disable-next-line: no-console
    console.log(entry.buildLogString());
  }
}
