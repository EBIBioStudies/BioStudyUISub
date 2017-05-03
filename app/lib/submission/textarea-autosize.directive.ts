import {Inject, Input, ElementRef, HostListener, Directive} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';

interface CSSStyleDeclarationWithResize extends CSSStyleDeclaration {
    resize: string
}

@Directive({
    selector: 'textarea[autosize]'
})
export class TextareaAutosize {
    @Input('autosize') private maxHeight:number;
    private minHeight:number = 50;

    constructor(@Inject(ElementRef) private element: ElementRef) {
    }

    ngAfterContentInit(): void {
        let el = this.element.nativeElement;
        const style: CSSStyleDeclarationWithResize = el.style as CSSStyleDeclarationWithResize;
        style.overflowY = 'hidden';
        style.resize = 'none';
        style.maxHeight = `${this.maxHeight}px`;

        Observable.fromEvent(window, 'resize')
            .debounceTime(250)
            .distinctUntilChanged((evt:any) => evt.timeStamp)
            .subscribe(() => this.adjust());
    }

    ngAfterContentChecked(): void {
        this.adjust();
    }

    @HostListener('input') onInput(): void {
        this.adjust();
    }

    private adjust(): void {
        let el = this.element.nativeElement;

        el.style.height = 'auto';
        el.style.height = (el.scrollHeight < this.minHeight ? this.minHeight : el.scrollHeight) + 'px';

        if (el.scrollHeight > this.maxHeight) {
            el.style.overflowY = 'scroll';
        } else {
            el.style.overflowY = 'hidden';
        }
    }
}