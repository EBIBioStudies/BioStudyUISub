import { Router } from '@angular/router';
import * as pluralize from 'pluralize';
import { Component, ViewChild } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { SidebarFile } from './direct-submit-sidebar.component';

@Component({
  selector: 'st-direct-submit',
  templateUrl: './direct-submit.component.html',
  styleUrls: ['./direct-submit.component.css']
})
export class DirectSubmitComponent {
  collapseSideBar: Boolean = false;
  files: any;
  studies: any;

  @ViewChild('sidebar', { static: true })
  private sidebar;

  /**
   * Initally collapses the sidebar for tablet-sized screens.
   * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
   */
  constructor(
    public appConfig: AppConfig,
    private router: Router
  ) {
    this.collapseSideBar = window.innerWidth < this.appConfig.tabletBreak;
  }

  get location() {
    return window.location;
  }

  getAccno(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'accno');
  }

  getError(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'errorMessage');
  }

  getLog(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'log');
  }

  getRawFiles() {
    if (!this.sidebar.model.files) {
      return [];
    }

    this.sidebar.model.files.filter((file) => !file.isStudy);
  }

  getRelease(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'releaseDate');
  }

  getStudyFiles() {
    this.sidebar.model.files.filter((file) => file.isStudy);
  }

  /**
   * Toggles the width of the request card and the log's visibility on click.
   */
  handleFileCardClick(args: { accno: string, event: Event, hasSubmitFailed: boolean }) {
    const { accno, event, hasSubmitFailed } = args;
    const containerEl = event.currentTarget as HTMLElement;
    const logElement = containerEl.querySelector('.log-container');

    if (logElement && hasSubmitFailed) {
      logElement.classList.toggle('hidden');
    } else {
      this.router.navigate([`/submissions/edit/${accno}`, { method: 'FILE' }]);
    }
  }

  handleIsStudyChange(args: { fileName: string, isStudy: boolean }) {
    const { fileName, isStudy } = args;
    this.sidebar.toggleStudyFile(fileName, isStudy);
  }

  isBusy(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'inprogress');
  }

  isFail(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'failed');
  }

  isPending() {
    return this.sidebar.hasRequests;
  }

  isSuccess(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'successful');
  }

  onFilesChange(files: SidebarFile[]): void {
    this.files = files.filter((file) => !file.isStudy);
    this.studies = files.filter((file) => file.isStudy);
  }

  onToggle(): void {
    this.collapseSideBar = !this.collapseSideBar;
  }

  /**
   * Convenience alias to pluralise a given noun.
   * @param {string} noun - Target noun.
   * @param {number} count - Number of noun-designated entities.
   * @returns {string} Noun in the
   */
  pluralise(noun: string, count: number = this.sidebar.selectedFileCount) {
    return pluralize(noun, count);
  }

  uploadedCount(): number {
    return this.sidebar.selectedFileCount - this.sidebar.errorFiles;
  }
}
