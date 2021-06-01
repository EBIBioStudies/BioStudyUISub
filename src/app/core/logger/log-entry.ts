import { LogLevel } from './log-levels';

interface LogJsonFormat {
  level: string;
  userEmail: string;
  message: string;
  stackTrace: string;
}

export class LogEntry {
  constructor(
    public message: string = '',
    public level: LogLevel = LogLevel.INFO,
    public stackTrace: string = '',
    public userEmail: string = ''
  ) {}

  buildLogJsonFormat(): LogJsonFormat {
    const level: string = LogLevel[this.level];

    return {
      level: level.toLowerCase(),
      userEmail: this.userEmail,
      message: this.message,
      stackTrace: this.stackTrace
    };
  }

  buildLogString(): string {
    const level: string = LogLevel[this.level];
    return `${new Date()} [${level.toLowerCase()}] - ${this.userEmail} - ${this.message} - ${this.stackTrace}`;
  }
}
