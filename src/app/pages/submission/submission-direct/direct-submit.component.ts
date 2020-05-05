import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { AppConfig } from 'app/app.config';
import * as pluralize from 'pluralize';

@Component({
  selector: 'st-direct-submit',
  templateUrl: './direct-submit.component.html',
  styleUrls: ['./direct-submit.component.css']
})
export class DirectSubmitComponent {
  collapseSideBar: Boolean = false;

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

  getRelease(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'releaseDate');
  }

  /**
   * Toggles the width of the request card and the log's visibility on click.
   * @param {Event} event - DOM object for the click action.
   */
  handleFileCardClick(event: Event, isFail: boolean, accno: string) {
    const containerEl = event.currentTarget as HTMLElement;
    const logElement = containerEl.querySelector('.log-container');

    if (logElement && isFail) {
      logElement.classList.toggle('hidden');
    } else {
      this.router.navigate([`/submissions/edit/${accno}`, { method: 'FILE' }]);
    }
  }

  isBusy(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'inprogress');
  }

  isFail(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'failed');
  }

  isSuccess(studyIdx: number) {
    return this.sidebar.studyProp(studyIdx, 'successful');
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
