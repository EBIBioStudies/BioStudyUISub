import { Component, Input } from '@angular/core';
import { ModalService } from 'app/shared/modal/modal.service';

@Component({
  selector: 'st-field-errors',
  templateUrl: './field-errors.component.html'
})
export class FieldErrorsComponent {
  errorLengthThreshold: number = 200;
  showSeeMore: boolean = false;
  singleLineError: string = '';

  @Input() errors: string[] = [];

  constructor(private modalService: ModalService) {}

  get formattedErrors(): string {
    this.singleLineError = this.errors.join(' ');

    if (this.singleLineError.length > this.errorLengthThreshold) {
      this.showSeeMore = true;

      return `${this.singleLineError.substring(0, this.errorLengthThreshold)}...`;
    }

    return this.singleLineError;
  }

  onSeeMoreClick(): void {
    this.modalService.alert(this.singleLineError, '', 'Close', '600px', { class: 'modal-lg' });
  }
}
