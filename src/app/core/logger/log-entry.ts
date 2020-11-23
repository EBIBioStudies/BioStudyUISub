import { LogLevel } from './log-levels';

interface LogJsonFormat {
  level: string;
  userEmail: string;
  message: string;
  params: any[];
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
    public extraInfo: any[] = [],
    public userEmail: string = ''
  ) {}

  buildLogJsonFormat(): LogJsonFormat {
    const level: string = LogLevel[this.level];
    const isUpload: boolean = this.level === LogLevel.UPLOAD;
    const params: any[] = isUpload ? this.formatFileParams(this.extraInfo) : this.extraInfo;

    return {
      level: level.toLowerCase(),
      userEmail: this.userEmail,
      message: this.message,
      params
    };
  }

  buildLogString(): string {
    const level: string = LogLevel[this.level];
    const value: string = `${new Date()} [${level.toLowerCase()}] - ${this.userEmail} - ${this.message}`;
    const isUpload: boolean = this.level === LogLevel.UPLOAD;

    if (this.extraInfo.length > 0) {
      const params: any[] = isUpload ? this.formatFileParams(this.extraInfo) : this.extraInfo;
      const formattedParams = this.formatParams(params);
      return `${value} - ${formattedParams}`;
    }

    return value;
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
