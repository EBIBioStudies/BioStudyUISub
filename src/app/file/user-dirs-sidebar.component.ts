import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    forwardRef
} from '@angular/core';

import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {FileService} from './file.service';

@Component({
    selector: 'user-dirs-sidebar',
    template: `
<aside class="left-side sidebar sidebar-offcanvas"
       [ngClass]="{'collapse-left' : collapsed}">
    <div class="menu-toggle">
        <button class="minimise-btn btn pull-right"
                [ngClass]="{'inactive': !collapsed}"
                [disabled]="editing"
                (click)="onToggle($event)"
                tooltip="{{collapsed ? 'Maximize sidebar' : 'Minimize sidebar'}}"
                container="body"
                placement="right">
            <i class="fa fa-fw fa-lg"
               [ngClass]="{'fa-toggle-left': !collapsed, 'fa-toggle-right': collapsed}"></i>
        </button>
        <tabset [ngClass]="{'invisible': collapsed}">
            <tab heading="Explorer" active="true"></tab>
        </tabset>
    </div>
    <ul class="sidebar-menu">
        <li *ngFor="let dir of dirs" class="sidebar-item success" [ngClass]="{'active': dir.path === selectedPath}">
            <a *ngIf="collapsed" 
                (click)="onDirSelect(dir)"> 
                <i class="fa fa-fw fa-folder"></i>
            </a>
            <a *ngIf="!collapsed"    
                (click)="onDirSelect(dir)">
                <i class="fa fa-fw fa-folder"></i><span>{{dir.name}}</span>
            </a>
        </li>
    </ul>
</aside>
`, providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UserDirsSideBarComponent), multi: true}
    ]
})
export class UserDirsSideBarComponent implements OnInit, ControlValueAccessor {
    @Input() collapsed?: boolean = false;
    @Output() toggle? = new EventEmitter();
    @Output() select = new EventEmitter();

    private selectedPath: string;

    dirs = [];

    constructor(private fileService: FileService) {
    }

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };
    private validateFn: any = () => {
    };

    get value() {
        return this.selectedPath;
    }

    set value(val) {
        this.selectedPath = val;
        this.onChange(val);
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value) {
            this.selectedPath = value;
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

    ngOnInit() {
        this.fileService.getUserDirs()
            .subscribe(
                (data) => {
                    this.dirs = data;
                }
            );
    }

    onToggle(e) {
        e.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
        }
    }

    onDirSelect(d) {
        this.value = d.path;
        if (this.select) {
            this.select.emit(d.path);
        }
    }
}