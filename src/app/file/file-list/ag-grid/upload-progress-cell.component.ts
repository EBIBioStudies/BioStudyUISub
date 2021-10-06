import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UploadErrorModalComponent } from 'app/file/upload-error-modal/upload-error-modal.component';
import { FileUpload } from 'app/file/shared/file-upload-list.service';
import { LogService } from 'app/core/logger/log.service';

@Component({
  selector: 'st-progress-cell',
  templateUrl: './upload-progress-cell.component.html',
  styleUrls: ['./upload-progress-cell.component.css']
})
export class ProgressCellComponent implements AgRendererComponent {
  private type?: string;
  private upload?: FileUpload;

  constructor(private modalService: BsModalService, private logger: LogService) {}

  agInit(params: any): void {
    this.type = params.data.type;
    this.upload = params.data.upload;
  }

  get errorTitle(): string {
    return this.upload?.error.title || '';
  }

  get errorDetail(): string {
    return this.upload?.error.detail || '';
  }

  get isUploading(): boolean {
    return Boolean(this.upload?.isUploading() && !this.upload?.isFailed()) || false;
  }

  get value(): number {
    if (this.upload) {
      if (this.upload.isFailed()) {
        this.logger.error('Error uploading file', `${this.upload.error.title} - ${this.upload.error.detail}`);

        return -1;
      }

      return this.upload.progress;
    }

    if (this.type === 'FILE' || this.type === 'ARCHIVE') {
      return 100;
    }

    return 0;
  }

  /**
   * Mandatory - Get the cell to refresh.
   * @see {@link https://www.ag-grid.com/javascript-grid-cell-editor/}
   * @returns By returning false, the grid will remove the component from the DOM and create
   * a new component in it's place with the new values.
   */
  refresh(): boolean {
    return false;
  }

  onErrorClick(): void {
    this.modalService.show(UploadErrorModalComponent, {
      initialState: { errorDetail: this.errorDetail }
    });
  }
}
