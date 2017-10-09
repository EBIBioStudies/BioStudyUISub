import {
    Component,
    forwardRef
} from '@angular/core';

import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS
} from '@angular/forms';

import 'rxjs/add/observable/timer';

@Component({
    selector: 'orcid-input-box',
    template: `
    <div class="input-group">
         <input type="text"
                class="form-control"
                [(ngModel)]="value"
                pattern="/^\d{4}-\d{4}-\d{4}-\d{4}$/">
                <div class="input-group-addon orcid-popup" (click)="openPopup()">
                   <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
    </div>            
`,
    styles: [
        '.orcid-popup {cursor: pointer;}'
    ],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ORCIDInputBoxComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => ORCIDInputBoxComponent), multi: true}
    ]
})

export class ORCIDInputBoxComponent implements ControlValueAccessor {

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };
    private validateFn: any = () => {
    };

    private orcidValue = '';

    get value() {
        return this.orcidValue;
    }

    set value(val) {
        this.orcidValue = val;
        this.onChange(val);
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value) {
            this.orcidValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn) {
        this.onChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    private mlistener = null;

    messageListener() {
        if (!this.mlistener) {
            let obj = this;

            this.mlistener = function (event) {
                console.debug('in message callback..', event);
                let msg = event.data;
                if (!msg.thor) {
                    return;
                }

                let data = JSON.parse(msg.thor);
                let orcid = data['orcid-profile']['orcid-identifier']['path'];
                console.debug('orcid: ' + orcid);

                obj.value = orcid;
            }
        }
        return this.mlistener;
    }

    ngOnInit() {
        console.log('added message listener');
        window.addEventListener('message', this.messageListener());
    }

    ngOnDestroy() {
        console.log('removed message listener');
        window.removeEventListener('message', this.messageListener());
    }

    openPopup() {
        let thorIFrame: any = document.getElementById("thor");
        console.debug("thor iframe", thorIFrame);

        let w = thorIFrame.contentWindow;
        console.debug("thor iframe.wondow", w);

        w.postMessage('openPopup', '*');
    }
}


