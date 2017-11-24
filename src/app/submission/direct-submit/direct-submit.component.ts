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

    constructor(private submitService: DirectSubmitService, private appConfig: AppConfig) {

        //Initally collapses the sidebar for tablet-sized screens
        this.collapseSideBar = window.innerWidth < this.appConfig.tabletBreak;
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
