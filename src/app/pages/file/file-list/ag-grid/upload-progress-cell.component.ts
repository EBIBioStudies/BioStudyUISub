import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular/dist/interfaces';
import { FileUpload } from '../../shared/file-upload-list.service';

@Component({
  selector: 'st-progress-cell',
  templateUrl: './upload-progress-cell.component.html',
  styleUrls: ['./upload-progress-cell.component.css']
})
export class ProgressCellComponent implements AgRendererComponent {
  private type?: string;
  private upload?: FileUpload;

  agInit(params: any): void {
    this.type = params.data.type;
    this.upload = params.data.upload;
  }

  get error(): string {
    return ((this.upload || {}) as any).error || '';
  }

  get isUploading(): boolean {
    return Boolean(this.upload && !this.upload.isFailed());
  }

  get value(): number {
    if (this.upload) {
      if (this.upload.isFailed()) {
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
   * @returns {boolean} By returning false, the grid will remove the component from the DOM and create
   * a new component in it's place with the new values.
   */
  refresh(): boolean {
    return false;
  }
}
