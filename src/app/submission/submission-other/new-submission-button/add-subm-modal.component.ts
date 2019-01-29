import {AfterViewInit, Component} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'add-subm-modal',
    templateUrl: './add-subm-modal.component.html'
})
export class AddSubmModalComponent implements AfterViewInit {
    selected: string = 'Default';
    templates?: Array<{ name: string, description: string }> = [];
    onOk?: Function;

    constructor(public bsModalRef: BsModalRef) {
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