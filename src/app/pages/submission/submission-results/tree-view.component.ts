import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    Input,
    OnChanges,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

export interface TreeViewCustomNodeComponent {
    onNodeData(data: any): void;
}

export interface TreeViewConfig {
    nodeComponentClass: Type<TreeViewCustomNodeComponent>
    children(data: any): any[];
}

@Component({
    selector: 'st-tree-view-node',
    template: `
    <span class="node">
        <i *ngIf="hasChildren"
           class="fa"
           [ngClass]="{'fa-minus-square-o': !isCollapsed, 'fa-plus-square-o': isCollapsed}"
           (click)="isCollapsed = !isCollapsed"
           aria-hidden="true"></i>
           <ng-template #nodeTemplate></ng-template>
    </span>
    <ul [collapse]="isCollapsed">
        <li  *ngFor="let child of children">
            <st-tree-view-node [data]="child"
                               [config]="config">
            </st-tree-view-node>
        </li>
    </ul>
`,
    styles: [`
li {
    list-style-type:none;
    margin:0;
    padding:10px 5px 0 5px;
    position:relative
}
li::before, li::after {
    content:'';
    left:-20px;
    position:absolute;
    right:auto
}
li::before {
    border-left:1px solid #999;
    bottom:50px;
    height:100%;
    top:0;
    width:1px
}
li::after {
    border-top:1px solid #999;
    height:20px;
    top:25px;
    width:25px
}
:host span.node {
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    border:1px solid #999;
    border-radius:5px;
    display:inline-block;
    padding:3px 8px;
    text-decoration:none
}

li:last-child::before {
    height:25px
}
`]
})
export class TreeViewNodeComponent implements AfterViewInit, OnChanges {
    @Input() config?: TreeViewConfig;
    @Input() data?: any;
    isCollapsed: boolean = true; // All branches will be collapsed by default.
    @ViewChild('nodeTemplate', {read: ViewContainerRef}) vcr;

    private compRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

    get children(): any [] {
        return this.config ? this.config.children(this.data) : [];
    }

    get hasChildren(): boolean {
        return this.children.length > 0;
    }

    ngAfterViewInit() {
        if (this.config) {
            const compFactory = this.componentFactoryResolver.resolveComponentFactory(this.config.nodeComponentClass);

            this.compRef = this.vcr.createComponent(compFactory);
            this.detectChanges();
        }
    }

    ngOnChanges() {
        this.detectChanges();

        // Reveals only branches of the tree that indicate error.
        if (this.hasChildren && this.data.level === 'ERROR') {
            this.isCollapsed = false;
        }
    }

    private detectChanges() {
        if (this.compRef) {
            (<TreeViewCustomNodeComponent>this.compRef.instance).onNodeData(this.data);
            this.compRef.changeDetectorRef.detectChanges();
        }
    }
}


@Component({
    selector: 'st-tree-view',
    template: `
        <div class="tree">
            <st-tree-view-node [data]="data"
                            [config]="config">
            </st-tree-view-node>
        </div>
    `,
    styles: [`
        .tree {
            min-height:20px;
            padding:10px;
        }
    `]
})
export class TreeViewComponent {
    @Input() config?: TreeViewConfig;
    @Input() data?: any;
}
