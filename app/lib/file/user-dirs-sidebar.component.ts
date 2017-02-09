import {
    Component,
    Inject,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';

import {FileService} from './file.service';

@Component({
    selector: 'user-dirs-sidebar',
    template: `
<aside class="left-side sidebar sidebar-offcanvas"
       [ngClass]="{'collapse-left' : collapsed}">
    <ul class="sidebar-menu">
        <li class="menu-toggle">
            <a (click)="onToggle($event)">
                 <i class="fa fa-bars fa-fw"></i> 
                 <span *ngIf="!collapsed">Minimise</span>
            </a>
        </li>
        <li *ngFor="let dir of dirs" [ngClass]="{'active': dir.path === selectedPath}">
            <a *ngIf="collapsed" 
                (click)="onDirSelect(dir)"> 
                <i class="fa fa-fw fa-folder"></i>
            </a>
            <a *ngIf="!collapsed"    
                (click)="onDirSelect(dir)">
                <i class="fa fa-fw fa-folder"></i>
                <span>{{dir.name}}</span>
            </a>
        </li>
    </ul>
</aside>
`
})
export class UserDirsSideBarComponent implements OnInit {
    @Input() initPath?: string;
    @Input() collapsed?: boolean = false;
    @Output() toggle? = new EventEmitter();
    @Output() select = new EventEmitter();

    private dirs = [];
    private selectedPath: string;

    constructor(@Inject(FileService) private fileService: FileService) {
    }

    ngOnInit() {
        if (this.initPath) {
            this.selectedPath = this.initPath;
        }
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
        this.selectedPath = d.path;
        if (this.select) {
            this.select.emit(d.path);
        }
    }
}