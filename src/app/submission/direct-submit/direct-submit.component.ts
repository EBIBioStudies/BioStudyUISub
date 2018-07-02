import {Component, ViewChild} from '@angular/core';

import {AppConfig} from "../../app.config";

import * as pluralize from "pluralize";

@Component({
    selector: 'direct-submit',
    templateUrl: './direct-submit.component.html',
    styleUrls: ['./direct-submit.component.css']
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

    error(studyIdx: number) {
        return this.sidebar.studyProp(studyIdx, 'errorMessage');
    }

    pluralise(noun: string) {
        return pluralize(noun, this.sidebar.selectedFileCount);
    }

    onToggle(ev): void {
        this.collapseSideBar = !this.collapseSideBar;
    }

    /**
     * Toggles the width of the request card and the log's visibility on click.
     * @param {Event} event - DOM object for the click action.
     */
    onClickError(event: Event) {
        const containerEl = event.currentTarget as HTMLElement;
        const targetEl = event.target as HTMLElement;
        const headingEl = containerEl.querySelector('.panel-heading');
        const logEl = containerEl.querySelector('.panel-body');

        if (logEl) {
            if (headingEl.contains(targetEl)) {
                logEl.classList.toggle('hidden');
            }
            containerEl.classList.toggle('container-full', !logEl.classList.contains('hidden'));
        }
    }
}