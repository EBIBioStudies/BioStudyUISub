import {Component, forwardRef, Input, OnChanges} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/timer';

@Component({
    selector: 'orcid-input-box',
    template: `
    <div class="input-group">
         <input type="text"
                class="form-control"
                placeholder="ORCID"
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

export class ORCIDInputBoxComponent implements ControlValueAccessor, OnChanges {

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };
    private validateFn: any = () => {
    };

    orcidValue = '';

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

    openPopup() {
        var thorIFrame = document.getElementById("thor");
        console.debug("thor iframe", thorIFrame);

        var w = thorIFrame.contentWindow;
        console.debug("thor iframe.wondow", w);

        w.bsst_openOrcidPopup((msg) => {
            console.debug('in message callback..');
            var data = JSON.parse(msg);
            var orcid = data['orcid-profile']['orcid-identifier']['path'];
            console.debug('orcid: ' + orcid);

            Observable.timer(1).subscribe(() => {
                console.debug("in timeout func...");
                this.value = orcid;
            });
        });
    }
}


