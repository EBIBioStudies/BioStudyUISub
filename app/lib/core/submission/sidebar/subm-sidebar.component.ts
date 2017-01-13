import {
    Component,
    Inject,
    Input,
    Output,
    EventEmitter,
    AfterContentInit,
    ContentChildren,
    QueryList
} from '@angular/core';

@Component({
    selector: 'sidebar-item',
    template: ''
})

export class SideBarItemComponent {
    @Input() label: string;
    @Input() icon: string;
    @Input() disabled?: boolean = false;
    @Output() click = new EventEmitter();

    clicked(e) {
        console.debug('clicked: ' + this.label);
        this.click.emit(e);
    }
}

@Component({
    selector: 'subm-sidebar',
    template: `
<aside class="left-side sidebar sidebar-offcanvas"
       [ngClass]="{'collapse-left' : collapsed}"
       *ngIf="!readonly">
    <ul class="sidebar-menu">
        <li class="menu-toggle">
            <a (click)="onToggle($event)">
                 <i class="fa fa-bars fa-fw"></i> 
                 <span *ngIf="!collapsed">Minimise</span>
            </a>
        </li>
        <li class="success" *ngFor="let child of childs">
            <a *ngIf="collapsed" 
                (click)="child.clicked($event)" 
                [tooltip]="child.label" 
                pacement="right"
                container="body"
                [ngClass]="{'disabled-link': child.disabled}">
                <i class="fa fa-fw" [ngClass]="child.icon"></i>
            </a>
            <a *ngIf="!collapsed"    
                (click)="child.clicked($event)"  
                [ngClass]="{'disabled-link': child.disabled}">
                <i class="fa fa-fw" [ngClass]="child.icon"></i>
                <span>{{child.label}}</span>
            </a>
        </li>
        <li>
            <hr/>
        </li>
        <!--li class="success" disabled>
            <a class="disabled-link" *ngIf="collapsed">
                <i class="fa fa-check" *ngIf="!saving"></i>
                <i class="fa fa-spinner fa-spin-2x" *ngIf="saving"></i>
            </a>
            <a class="disabled-link" *ngIf="!collapsed">
                <i class="fa fa-check" *ngIf="!saving"></i>
                <i class="fa fa-spinner fa-spin-2x" *ngIf="saving"></i>
                <span *ngIf="!saving">Saved</span>
                <span *ngIf="saving">Saving...</span>
            </a>
        </li-->
    </ul>
</aside>
`
})

export class SideBarComponent implements AfterContentInit {
    @Input() collapsed?: boolean = false;
    @Input() readonly?: boolean = false;
    @Output() toggle? = new EventEmitter();

    @ContentChildren(SideBarItemComponent)
    private childs: QueryList<SideBarItemComponent>;

    ngAfterContentInit() {
    }

    onToggle(e) {
        e.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
        }
    }
}