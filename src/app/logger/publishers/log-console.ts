import { LogPublisher } from './log-publisher';
import { LogEntry } from '../log-entry';

export class LogConsole extends LogPublisher {
  log(entry: LogEntry): void {
    console.log(entry.buildLogString());
  }
}
