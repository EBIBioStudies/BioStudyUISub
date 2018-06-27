import {Component, ViewChild} from '@angular/core';

import {AppConfig} from "../../app.config";

import * as pluralize from "pluralize";

@Component({
    selector: 'direct-submit',
    templateUrl: './direct-submit.component.html'
})
export class DirectSubmitComponent {
    collapseSideBar: Boolean = false;

    @ViewChild('sidebar')
    private sidebar;

    /**
     * Initally collapses the sidebar for tablet-sized screens.
     * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
     */
    constructor(public appConfig: AppConfig) {
        this.collapseSideBar = window.innerWidth < this.appConfig.tabletBreak;
    }

    get location() {
        return window.location;
    }

    getAccno(studyIdx: number) {
        return this.sidebar.studyProp(studyIdx, 'accno');
    }

    getRelease(studyIdx: number) {
        return this.sidebar.studyProp(studyIdx, 'releaseDate');
    }

    getLog(studyIdx: number) {
        return this.sidebar.studyProp(studyIdx, 'log');
    }

    isBusy(studyIdx: number) {
        return this.sidebar.studyProp(studyIdx, 'inprogress');
    }

    isSuccess(studyIdx: number) {
        return this.sidebar.studyProp(studyIdx, 'successful');
    }

    isFail(studyIdx: number) {
        return this.sidebar.studyProp(studyIdx, 'failed');
    }

    pluralise(noun: string) {
        return pluralize(noun, this.sidebar.selectedFileCount);
    }

    onToggle(ev): void {
        this.collapseSideBar = !this.collapseSideBar;
    }
}