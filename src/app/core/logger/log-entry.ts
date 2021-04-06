import { LogLevel } from './log-levels';

interface LogJsonFormat {
  level: string;
  userEmail: string;
  message: string;
  stackTrace: string;
}

interface FileParams {
  name: string;
  size: number;
  type: string;
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

  private formatFileParams(files: File[]): FileParams[] {
    return files.map((file) => ({ name: file.name, size: file.size, type: file.type }));
  }

  private formatParams(params: any[]): string {
    const hasObject = params.some((param) => typeof param === 'object');

    if (hasObject) {
      return params.reduce((formattedParams, currentParam) => `${formattedParams}${JSON.stringify(currentParam)},`, '');
    }

    return params.join(',');
  }
}
