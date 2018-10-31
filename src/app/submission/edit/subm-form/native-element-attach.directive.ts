import {NgControl} from '@angular/forms';
import {Directive, ElementRef, Input, OnChanges, OnDestroy} from '@angular/core';

@Directive({
    selector: '[nativeElementAttach]'
})
export class NativeElementAttachDirective implements OnChanges, OnDestroy {
    constructor(private el: ElementRef, private ngControl: NgControl) {
    }

    ngOnChanges() {
        setTimeout(this.update);
    }

    ngOnDestroy() {
        (<any>this.ngControl.control).nativeElement = undefined;
    }

    private update = () => {
        if (this.ngControl && this.ngControl.control) {
            const ctrl = <any>this.ngControl.control;
            ctrl.nativeElement = this.el.nativeElement;
        }
    }
}