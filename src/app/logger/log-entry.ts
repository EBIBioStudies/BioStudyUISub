import { LogLevel } from './log-levels';

export class LogEntry {
  constructor(
    public message: string = '',
    public level: LogLevel = LogLevel.INFO,
    public extraInfo: any[] = [],
    public userEmail: string = ''
  ) {}

  buildLogString(): string {
    const type: string = LogLevel[this.level];
    const value: string = `${new Date()} [${type}] - ${this.userEmail} - ${this.message}`;

    if (this.extraInfo.length > 0) {
      const formattedParams = this.formatParams(this.extraInfo);
      return `${value} - ${formattedParams}`;
    }

    return value;
  }

  buildLogJsonFormat() {
    const type: string = LogLevel[this.level];

    return {
      date: new Date(),
      type,
      userEmail: this.userEmail,
      message: this.message,
      params: this.extraInfo
    };
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
