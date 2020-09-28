import { Router } from '@angular/router';
import pluralize from 'pluralize';
import { Component, ViewChild } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { SidebarFile } from './direct-submit-sidebar.component';

@Component({
  selector: 'st-direct-submit',
  templateUrl: './direct-submit.component.html',
  styleUrls: ['./direct-submit.component.css']
})
export class DirectSubmitComponent {
  collapseSideBar: boolean = false;
  files: any;
  studies: any;

  @ViewChild('sidebar', { static: true })
  private sidebar;

  /**
   * Initally collapses the sidebar for tablet-sized screens.
   * @param appConfig - Global configuration object with app-wide settings.
   */
  constructor(
    public appConfig: AppConfig,
    private router: Router
  ) {
    this.collapseSideBar = window.innerWidth < this.appConfig.tabletBreak;
  }

  get location(): Location {
    return window.location;
  }

  getAccno(studyIdx: number): string {
    return this.sidebar.studyProp(studyIdx, 'accno');
  }

  getError(studyIdx: number): string {
    return this.sidebar.studyProp(studyIdx, 'errorMessage');
  }

  getLog(studyIdx: number): string {
    return this.sidebar.studyProp(studyIdx, 'log');
  }

  getRelease(studyIdx: number): string {
    return this.sidebar.studyProp(studyIdx, 'releaseDate');
  }

  getStudyFiles(): void {
    this.sidebar.model.files.filter((file) => file.isStudy);
  }

  /**
   * Toggles the width of the request card and the log's visibility on click.
   */
  handleFileCardClick(args: { accno: string, event: Event, hasSubmitFailed: boolean }): void {
    const { accno, event, hasSubmitFailed } = args;
    const containerEl = event.currentTarget as HTMLElement;
    const logElement = containerEl.querySelector('.log-container');

    if (logElement && hasSubmitFailed) {
      logElement.classList.toggle('hidden');
    } else {
      this.router.navigate([`/submissions/edit/${accno}`, { method: 'FILE' }]);
    }
  }

  handleIsStudyChange(args: { fileName: string, isStudy: boolean }): void {
    const { fileName, isStudy } = args;
    this.sidebar.toggleStudyFile(fileName, isStudy);
  }

  isBusy(studyIdx: number): boolean {
    return this.sidebar.studyProp(studyIdx, 'inprogress');
  }

  isFail(studyIdx: number): boolean {
    return this.sidebar.studyProp(studyIdx, 'failed');
  }

  isPending(): boolean {
    return this.sidebar.hasRequests;
  }

  isSuccess(studyIdx: number): boolean {
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
   * @param noun - Target noun.
   * @param count - Number of noun-designated entities.
   * @returns Noun in the
   */
  pluralise(noun: string, count: number = this.sidebar.selectedFileCount): string {
    return pluralize(noun, count);
  }

  uploadedCount(): number {
    return this.sidebar.selectedFileCount - this.sidebar.errorFiles;
  }
}
