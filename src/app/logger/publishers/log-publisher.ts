import { LogEntry } from '../log-entry';
import { LogLevel } from '../log-levels';

export abstract class LogPublisher {
  location: string = '';

  abstract log(record: LogEntry, level: LogLevel): void;
}
