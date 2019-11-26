import { LogLevel } from './log-levels';

export class LogEntry {
  constructor(
    public message: string = '',
    public level: LogLevel = LogLevel.INFO,
    public extraInfo: any[] = [],
    public userEmail: string = ''
  ) {}

  buildLogJsonFormat() {
    const type: string = LogLevel[this.level];
    const isUpload: boolean = this.level === LogLevel.UPLOAD;
    const params: any[] = isUpload ? this.formatFileParams(this.extraInfo) : this.extraInfo;

    return {
      date: new Date(),
      type,
      userEmail: this.userEmail,
      message: this.message,
      params: params
    };
  }

  buildLogString(): string {
    const type: string = LogLevel[this.level];
    const value: string = `${new Date()} [${type}] - ${this.userEmail} - ${this.message}`;
    const isUpload: boolean = this.level === LogLevel.UPLOAD;

    if (this.extraInfo.length > 0) {
      const params: any[] = isUpload ? this.formatFileParams(this.extraInfo) : this.extraInfo;
      const formattedParams = this.formatParams(params);
      return `${value} - ${formattedParams}`;
    }

    return value;
  }

  private formatFileParams(files: File[]) {
    return files.map((file) => ({ name: file.name, size: file.size, type: file.type }));
  }

  private formatParams(params: any[]): string {
    const hasObject = params.some((param) => typeof param === 'object');

    if (hasObject) {
      return params.reduce((formattedParams, currentParam) => (
        `${formattedParams}${JSON.stringify(currentParam)},`
      ), '');
    }

    return params.join(',');
  }
}
