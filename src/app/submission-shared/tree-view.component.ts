import {
    Component,
    Input,
    Type,
    ViewChild,
    ViewContainerRef,
    AfterViewInit,
    OnChanges,
    ComponentFactoryResolver
} from '@angular/core';

export interface TreeViewCustomNodeComponent {
    onNodeData(data: any): void;
}

export interface TreeViewConfig {
    nodeComponentClass: Type<TreeViewCustomNodeComponent>
    children(data: any): any[];
}

@Component({
    selector: 'tree-view-node',
    template: `
    <span class="node">
        <i *ngIf="hasChildren" 
           class="fa"
           [ngClass]="{'fa-minus-square-o': !isCollapsed, 'fa-plus-square-o': isCollapsed}"
           (click)="isCollapsed = !isCollapsed"
           aria-hidden="true"></i>
           <template #nodeTemplate></template>
    </span>
    <ul [collapse]="isCollapsed">
        <li  *ngFor="let child of children">
            <tree-view-node [data]="child"
                            [config]="config"></tree-view-node>
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
    height:30px
}
`]
})
export class TreeViewNodeComponent implements AfterViewInit, OnChanges  {
    @Input() data: any;
    @Input() config: TreeViewConfig;

    @ViewChild('nodeTemplate', {read: ViewContainerRef}) vcr;

    private compRef;
    isCollapsed: boolean = false;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    get children(): any [] {
        return this.config.children(this.data);
    }

    get hasChildren(): boolean {
        return this.children.length > 0;
    }

    ngAfterViewInit() {
        let compFactory = this.componentFactoryResolver.resolveComponentFactory(this.config.nodeComponentClass);
        this.compRef = this.vcr.createComponent(compFactory);
        this.detectChanges();
    }

    ngOnChanges() {
        this.detectChanges();
    }

    private detectChanges() {
        if (this.compRef) {
            (<TreeViewCustomNodeComponent>this.compRef.instance).onNodeData(this.data);
            this.compRef.changeDetectorRef.detectChanges();
        }
    }
}


@Component({
    selector: 'tree-view',
    template: `
<div class="tree">
     <tree-view-node [data]="data" 
                     [config]="config"></tree-view-node>                   
</div>        

`,
    styles: [`
.tree {
    min-height:20px;
    padding:19px;
    background-color:#fbfbfb;
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
    border-radius:4px;
    -webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05);
    -moz-box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05)
}
`]
})
export class TreeViewComponent {
    @Input() data: any;
    @Input() config: TreeViewConfig;
}