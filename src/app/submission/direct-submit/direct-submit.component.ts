import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {
    DirectSubmitService,
    DirectSubmitRequest
} from './direct-submit.service';
import {AppConfig} from "../../app.config";

@Component({
    selector: 'direct-submit',
    templateUrl: './direct-submit.component.html'
})
export class DirectSubmitComponent implements OnInit, OnDestroy {
    private sb: Subscription;

    request: DirectSubmitRequest;
    collapseSideBar: Boolean = false;

    /**
     * Initally collapses the sidebar for tablet-sized screens.
     * @param {DirectSubmitService} submitService - Singleton service for all submission transactions.
     * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
     */
    constructor(private submitService: DirectSubmitService, public appConfig: AppConfig) {
        this.collapseSideBar = window.innerWidth < this.appConfig.tabletBreak;
    }

    get location() {
        return window.location;
    }

    ngOnInit(): void {
        this.sb = this.submitService.newRequest$.subscribe((index: number) => {
            this.request = this.submitService.request(index);
        });
    }

    ngOnDestroy(): void {
        this.sb.unsubscribe();
    }

    onToggle(ev): void {
        this.collapseSideBar = !this.collapseSideBar;
    }
}
