import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    forwardRef
} from '@angular/core';

import {FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FileService} from './file.service';

@Component({
    selector: 'user-dirs-sidebar',
    template: `
<aside class="left-side sidebar sidebar-offcanvas"
       [ngClass]="{'collapse-left' : collapsed}">
    <ul class="sidebar-menu">
        <li class="sidebar-item menu-toggle">
            <a (click)="onToggle($event)">
                 <i class="fa fa-bars fa-fw"></i> 
                 <span *ngIf="!collapsed">Minimise</span>
            </a>
        </li>
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
        console.log(d);
        this.value = d.path;
        if (this.select) {
            this.select.emit(d.path);
        }
    }
}