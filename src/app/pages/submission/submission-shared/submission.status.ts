export class SubmissionStatus {
  static PROCESSED = new SubmissionStatus('PROCESSED', 'Submitted');
  static PROCESSING = new SubmissionStatus('PROCESSING', 'Processing');
  static REQUESTED = new SubmissionStatus('REQUESTED', 'Requested');

  readonly displayValue: string;
  readonly name: string;

  private constructor(name: string, displayValue: string) {
    this.name = name;
    this.displayValue = displayValue;
  }
}
