import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'add-subm-modal',
    templateUrl: './add-subm-modal.component.html'
})
export class AddSubmModalComponent implements OnInit, AfterViewInit {
    selected: string = 'Default';
    projectNames?: string[] = [];
    onOk?: Function;

    constructor(public bsModalRef: BsModalRef) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        (<HTMLInputElement>document.getElementsByClassName('project-radio')[0]).focus();
    }

    hide(): void {
        this.bsModalRef.hide()
    }

    ok(): void {
        if (this.onOk) {
            this.onOk(this.selected);
        }
    }
}