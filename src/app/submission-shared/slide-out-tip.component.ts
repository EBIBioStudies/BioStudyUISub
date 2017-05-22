import {
    Component,
    Input
} from '@angular/core';

@Component({
    selector: 'slide-out-tip',
    template: `
    <i class="fa fa-angle-right tip-icon" 
       (mouseover)="show()" 
       (mouseeneter)="show()"
       (mouseleave)="hide()"
       #icon></i>
    <span class="tip-text-wrap">
          <i class="tip-text" [ngClass]="{'show':showTip}">{{tip}}</i>
    </span>
`,
    styles: [
        `:host {
            display: inline-block;
            position: relative;
            margin: 0 0 0 5px;
            padding: 0;
            width: 70%;
            height: 18px;
            overflow: hidden;
        }`,
        `.tip-icon {
            display: inline-block;
            cursor: pointer;
            width: 15px;
        }`,
        `.tip-text-wrap {
            display: inline-block;
            position: relative;
            overflow: hidden;
            width: 600px;
            height: 100%;
        }`,
        `.tip-text {
            position: absolute;
            top: 0;
            left: -580px;
            width: 580px;
            display: inline-block;
            -webkit-transition: left 0.5s ease-in-out;
            -moz-transition: left 0.5s ease-in-out;
            -o-transition: left 0.5s ease-in-out;
            -ms-transition: left 0.5s ease-in-out;
            transition: left 0.5s ease-in-out;
        }`,
        `.tip-text.show {
            left: 0;
        }`
    ]

})
export class SlideOutTipComponent {
    @Input() tip: string;
    showTip: boolean = false;

    show() {
        this.showTip = true;
    }

    hide() {
        this.showTip = false;
    }
}