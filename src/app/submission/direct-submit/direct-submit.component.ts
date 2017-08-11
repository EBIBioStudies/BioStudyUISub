import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {
    DirectSubmitService,
    DirectSubmitRequest
} from './direct-submit.service';

@Component({
    selector: 'direct-submit',
    templateUrl: './direct-submit.component.html'
})
export class DirectSubmitComponent implements OnInit, OnDestroy {
    private sb: Subscription;

    request: DirectSubmitRequest;
    collapseSideBar = false;

    constructor(private submitService: DirectSubmitService) {
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
