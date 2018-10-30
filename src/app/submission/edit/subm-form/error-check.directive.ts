import {NgControl} from '@angular/forms';
import {Directive, ElementRef, Input, OnChanges, OnDestroy} from '@angular/core';

@Directive({
    selector: '[errorCheckName]'
})
export class ErrorCheckDirective implements OnChanges, OnDestroy {
    @Input('errorCheckName') controlName?: string;
    @Input('errorCheckIcon') controlIcon?: string;
    @Input('errorCheckRef') controlRef?: string;

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
            ctrl.controlName = this.controlName || '<Control Name>';
            ctrl.controlIcon = this.controlIcon || 'fa-question';
            ctrl.controlRef = this.controlRef;
        }
    }
}