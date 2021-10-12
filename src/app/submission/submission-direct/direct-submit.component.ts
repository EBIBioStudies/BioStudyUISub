import { Component, ViewChild } from '@angular/core';

import { AppConfig } from 'app/app.config';
import { SidebarFile } from './direct-submit-sidebar.component';
import pluralize from 'pluralize';

@Component({
  selector: 'st-direct-submit',
  templateUrl: './direct-submit.component.html',
  styleUrls: ['./direct-submit.component.scss']
})
export class DirectSubmitComponent {
  collapseSideBar: boolean = false;
  files: any;
  studies: any;
  supportedDirectSubmitFileExt: string[] = ['.json', '.xml', '.tsv', '.xlsx'];

  @ViewChild('sidebar', { static: true })
  private sidebar;

  /**
   * Initally collapses the sidebar for tablet-sized screens.
   * @param appConfig - Global configuration object with app-wide settings.
   */
  constructor(public appConfig: AppConfig) {
    this.collapseSideBar = window.innerWidth < this.appConfig.tabletBreak;
  }

  get location(): Location {
    return window.location;
  }

  get hasProjects(): boolean {
    return this.sidebar.getProjects().length > 0;
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

  getSupportedFileExt(): string {
    return this.supportedDirectSubmitFileExt.join(', ').replace(/, ([^,]*)$/, ' or $1');
  }

  handleFileChange(args: { fileName: string; isStudy: boolean; action: string }): void {
    const { fileName, isStudy, action } = args;
    this.sidebar.changeFile(fileName, isStudy, action);
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

  canBeStudyFile(file: File): boolean {
    return new RegExp(`(.*?).(${this.supportedDirectSubmitFileExt.join('|')})$`).test(file.name);
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
